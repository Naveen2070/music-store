import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password@123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiHideProperty()
  @IsString()
  @IsOptional()
  apiKey: string;

  @ApiHideProperty()
  @IsString()
  @IsOptional()
  twoFASecret?: string;

  @ApiHideProperty()
  @IsBoolean()
  @IsOptional()
  enable2FA?: boolean;
}
