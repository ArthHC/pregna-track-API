import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({
    description: 'ID do médico responsável',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  doctor_id: number;

  @ApiProperty({
    description: 'Nome da paciente',
    example: 'Maria',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento da paciente (opcional)',
    example: '1990-05-15',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @ApiPropertyOptional({
    description: 'Número de telefone da paciente (opcional)',
    example: '11999888777',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone_number?: string;

  @ApiPropertyOptional({
    description: 'Cor de identificação em hexadecimal (opcional)',
    example: '#FF5733',
    maxLength: 7,
    pattern: '^#[A-Fa-f0-9]{6}$',
  })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  badge_color?: string;
}
