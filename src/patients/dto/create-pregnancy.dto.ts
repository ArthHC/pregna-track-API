import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePregnancyDto {
  @ApiProperty({
    description: 'ID da paciente',
    example: 1
  })
  @IsNotEmpty()
  @IsInt()
  patient_id: number;

  @ApiPropertyOptional({
    description: 'Nome do bebê (opcional)',
    example: 'Pedro',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  baby_name?: string;

  @ApiProperty({
    description: 'Data Provável do Parto (Expected Delivery Date)',
    example: '2025-06-01',
    format: 'date'
  })
  @IsNotEmpty()
  @IsDateString()
  edd: string;

  @ApiPropertyOptional({
    description: 'Status da gravidez',
    example: 'Em acompanhamento',
    default: 'Em acompanhamento'
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Dias de assistência antes da data provável',
    example: 30,
    minimum: 0
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  assistance_days_before_edd: number;

  @ApiProperty({
    description: 'Dias de assistência após a data provável',
    example: 15,
    minimum: 0
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  assistance_days_after_edd: number;

  @ApiPropertyOptional({
    description: 'Data de nascimento do bebê (opcional)',
    example: '2025-06-01',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  baby_birth_date?: string;

  @ApiPropertyOptional({
    description: 'Observações sobre a gestação (opcional)',
    example: 'Primeira gestação, sem complicações'
  })
  @IsOptional()
  @IsString()
  observation?: string;
}