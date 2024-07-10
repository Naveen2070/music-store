import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/middleware/jwt/jwt-guard';
import { Enable2FAType } from 'src/common/types/2FA.types';
import { ValidateTokenDTO } from './dto/validateToken.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'The signed up user details are returned.',
  })
  signup(
    @Body()
    CreateUserDTO: CreateUserDTO,
  ): Promise<CreateUserDTO> {
    return this.userService.create(CreateUserDTO);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 201,
    description: 'The login user details are returned if login is successful.',
  })
  login(
    @Body()
    loginDTO: LoginDTO,
  ) {
    return this.authService.login(loginDTO);
  }

  @Get('enable2fa')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Enable 2FA for a user' })
  @ApiResponse({
    status: 201,
    description: 'The 2FA secret is returned.',
  })
  enableTwoFactorAuthentication(
    @Req()
    req,
  ): Promise<Enable2FAType> {
    return this.authService.enableTwoFactorAuthentication(req.user.userId);
  }

  @Post('validate2fa')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Validate 2FA token for a user' })
  @ApiResponse({
    status: 201,
    description: 'The validation result is returned.',
  })
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
  @ApiOperation({ summary: 'Disable 2FA for a user' })
  @ApiResponse({
    status: 201,
    description: 'The update result is returned.',
  })
  disable2FA(
    @Req()
    req,
  ): Promise<UpdateResult> {
    return this.authService.disable2FA(req.user.userId);
  }

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  @ApiOperation({ summary: 'Get profile of a user with API key' })
  @ApiResponse({
    status: 201,
    description: 'The profile of a user is returned if API key is valid.',
  })
  getProfile(@Req() req) {
    delete req.user.password;
    return {
      messeage: 'authenticated with API key',
      user: req.user,
    };
  }
}
