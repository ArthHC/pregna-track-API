import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  surname: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
