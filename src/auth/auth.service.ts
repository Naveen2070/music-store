import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import * as speakEasy from 'speakeasy';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from 'src/common/types/payload.type';
import { Enable2FAType } from 'src/common/types/2FA.types';
import { UpdateResult } from 'typeorm';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly artistsService: ArtistsService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOne(loginDTO);
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('password does not match');
    }

    delete user.password;

    const artist = await this.artistsService.findArtist(user.id);

    const payload: PayloadType = {
      email: user.email,
      sub: user.id,
    };

    if (artist) {
      payload.artistId = artist.id;
    }

    return { accessToken: this.jwtService.sign(payload) };
  }

  async enableTwoFactorAuthentication(userId: number): Promise<Enable2FAType> {
    const user = await this.usersService.findOneById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }
    const secret = speakEasy.generateSecret();
    const payload = {
      twoFASecret: secret.base32,
      enable2FA: true,
    };
    await this.usersService.update(user.id, payload);
    return { secret: secret.base32 };
  }

  async validateTwoFactorAuthentication(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      // find the user on the based on id
      const user = await this.usersService.findOneById(userId);

      // extract his 2FA secret

      // verify the secret with token by calling the speakeasy verify method
      const verified = speakEasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });

      // if validated then sends the json web token in the response
      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.usersService.disable2FA(userId);
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.usersService.findOneByApiKey(apiKey);
  }
}
