import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authKey } from 'src/common/constants/auth.constants';
import { PayloadType } from '../../types/payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authKey.SECRET_KEY,
    });
  }

  async validate(payload: PayloadType) {
    return {
      userId: payload.sub,
      email: payload.email,
      artistId: payload.artistId,
    };
  }
}
