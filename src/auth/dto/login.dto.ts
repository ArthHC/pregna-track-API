import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email do médico para login',
    example: 'joao.silva@email.com',
    format: 'email'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha do médico',
    example: '123456789',
    minLength: 6,
    type: 'string'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}