import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorDto } from './create-doctor.dto';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
  @ApiPropertyOptional({
    description: 'Nome do médico',
    example: 'Dr. João Carlos',
    maxLength: 45
  })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  name?: string;

  @ApiPropertyOptional({
    description: 'Sobrenome do médico',
    example: 'Silva Santos',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  surname?: string;

  @ApiPropertyOptional({
    description: 'Email do médico',
    example: 'joao.carlos@email.com',
    format: 'email',
    maxLength: 320
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string;

  @ApiPropertyOptional({
    description: 'Nova senha (será criptografada automaticamente)',
    example: 'novasenha123',
    minLength: 6,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password?: string;
}
