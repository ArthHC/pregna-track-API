import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({
    description: 'Nome da paciente',
    example: 'Maria',
    maxLength: 45
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  name: string;

  @ApiPropertyOptional({
    description: 'Sobrenome da paciente (opcional)',
    example: 'Santos',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  surname?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento da paciente (opcional)',
    example: '1990-05-15',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Número de telefone da paciente (opcional)',
    example: '11999888777',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Cor de identificação em hexadecimal (opcional)',
    example: '#FF5733',
    maxLength: 7,
    pattern: '^#[A-Fa-f0-9]{6}$'
  })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string;

  @ApiProperty({
    description: 'Data Provável do Parto (Expected Delivery Date)',
    example: '2025-06-01',
    format: 'date'
  })
  @IsNotEmpty()
  @IsDateString()
  EDD: string;

  @ApiProperty({
    description: 'Dias de assistência antes da data provável',
    example: 30,
    minimum: 0
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  assistanceDaysBeforeEDD: number;

  @ApiProperty({
    description: 'Dias de assistência após a data provável',
    example: 15,
    minimum: 0
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  assistanceDaysAfterEDD: number;

  @ApiPropertyOptional({
    description: 'Data de nascimento do bebê (opcional)',
    example: '2025-06-01',
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  babyBirthDate?: string;
  
  @ApiProperty({
    description: 'Status da gravidez',
    example: 'Em acompanhamento',
    maxLength: 20
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  pregnancyStatus: string;

  @ApiPropertyOptional({
    description: 'Paridade da paciente (ex: G1P0 = 1ª gestação, 0 partos) (opcional)',
    example: 'G1P0',
    maxLength: 12
  })
  @IsOptional()
  @IsString()
  @MaxLength(12)
  parity?: string;

  @ApiPropertyOptional({
    description: 'Observações sobre a paciente (opcional)',
    example: 'Primeira gestação, sem complicações'
  })
  @IsOptional()
  @IsString()
  observation?: string;

  @ApiProperty({
    description: 'ID do médico responsável',
    example: 1
  })
  @IsNotEmpty()
  @IsInt()
  doctorId: number;
}
