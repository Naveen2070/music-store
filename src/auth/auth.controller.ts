import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/middleware/jwt/jwt-guard';
import { Enable2FAType } from 'src/common/types/2FA.types';
import { ValidateTokenDTO } from './dto/validateToken.dto';
import { UpdateResult } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  signup(
    @Body()
    CreateUserDTO: CreateUserDTO,
  ): Promise<CreateUserDTO> {
    return this.userService.create(CreateUserDTO);
  }

  @Post('login')
  login(
    @Body()
    loginDTO: LoginDTO,
  ) {
    return this.authService.login(loginDTO);
  }

  @Get('enable2fa')
  @UseGuards(JwtAuthGuard)
  enableTwoFactorAuthentication(
    @Req()
    req,
  ): Promise<Enable2FAType> {
    return this.authService.enableTwoFactorAuthentication(req.user.userId);
  }

  @Post('validate2fa')
  @UseGuards(JwtAuthGuard)
  async validateTwoFactorAuthentication(
    @Req()
    req,
    @Body()
    validateTokenDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validateTwoFactorAuthentication(
      req.user.userId,
      validateTokenDTO.token,
    );
  }

  @Get('disable2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(
    @Req()
    req,
  ): Promise<UpdateResult> {
    return this.authService.disable2FA(req.user.userId);
  }
}
