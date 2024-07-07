import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { authKey } from 'src/common/constants/auth.constants';
import { JwtStrategy } from 'src/common/middleware/jwt/jwt-strategy';
import { ArtistsModule } from 'src/artists/artists.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: authKey.SECRET_KEY,
      signOptions: { expiresIn: authKey.EXPIRES_IN },
    }),
    ArtistsModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
