import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';
import { IsDateString, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @IsOptional()
  @IsString()
  @MaxLength(45)
  name?: string;

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

  @IsOptional()
  @IsDateString()
  EDD?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  assistanceDaysBeforeEDD?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  assistanceDaysAfterEDD?: number;

  @IsOptional()
  @IsDateString()
  babyBirthDate?: string;

  @IsOptional()
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

  @IsOptional()
  @IsInt()
  doctorId?: number;
}
