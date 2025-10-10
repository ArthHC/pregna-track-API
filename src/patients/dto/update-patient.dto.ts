import { PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';
import { IsDateString, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @ApiPropertyOptional({
    description: 'Nome da paciente (opcional para atualização)',
    example: 'Maria Silva',
    maxLength: 45
  })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  name?: string;

  @ApiPropertyOptional({
    description: 'Sobrenome da paciente (opcional para atualização)',
    example: 'Santos',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  surname?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento da paciente (opcional para atualização)',
    example: '1990-05-15',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Número de telefone da paciente (opcional para atualização)',
    example: '11999888777',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Cor de identificação (opcional para atualização)',
    example: '#FF5733',
    maxLength: 7
  })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string;

  @ApiPropertyOptional({
    description: 'Data Provável do Parto (opcional para atualização)',
    example: '2025-06-01',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  EDD?: string;

  @ApiPropertyOptional({
    description: 'Dias de assistência antes da data provável (opcional para atualização)',
    example: 30,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  assistanceDaysBeforeEDD?: number;

  @ApiPropertyOptional({
    description: 'Dias de assistência após a data provável (opcional para atualização)',
    example: 15,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  assistanceDaysAfterEDD?: number;

  @ApiPropertyOptional({
    description: 'Data de nascimento do bebê (opcional para atualização)',
    example: '2025-06-01',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  babyBirthDate?: string;

  @ApiPropertyOptional({
    description: 'Status da gravidez (opcional para atualização)',
    example: 'Parto realizado',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  pregnancyStatus?: string;

  @ApiPropertyOptional({
    description: 'Paridade da paciente (opcional para atualização)',
    example: 'G2P1',
    maxLength: 12
  })
  @IsOptional()
  @IsString()
  @MaxLength(12)
  parity?: string;

  @ApiPropertyOptional({
    description: 'Observações sobre a paciente (opcional para atualização)',
    example: 'Parto realizado sem complicações'
  })
  @IsOptional()
  @IsString()
  observation?: string;

  @ApiPropertyOptional({
    description: 'ID do médico responsável (opcional para atualização)',
    example: 2
  })
  @IsOptional()
  @IsInt()
  doctorId?: number;
}
