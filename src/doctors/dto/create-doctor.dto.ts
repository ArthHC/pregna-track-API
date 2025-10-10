import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'Nome do médico',
    example: 'Dr. João',
    maxLength: 45
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  name: string;

  @ApiProperty({
    description: 'Sobrenome do médico',
    example: 'Silva',
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  surname: string;

  @ApiProperty({
    description: 'Email único do médico',
    example: 'joao.silva@email.com',
    format: 'email',
    maxLength: 320
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  email: string;

  @ApiProperty({
    description: 'Senha do médico (será criptografada automaticamente)',
    example: '123456789',
    minLength: 6,
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
