import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  surname?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string;

  @IsNotEmpty()
  @IsDateString()
  EDD: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  assistanceDaysBeforeEDD: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  assistanceDaysAfterEDD: number;

  @IsOptional()
  @IsDateString()
  babyBirthDate?: string;
  
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  pregnancyStatus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  parity?: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsNotEmpty()
  @IsInt()
  doctorId: number;
}
