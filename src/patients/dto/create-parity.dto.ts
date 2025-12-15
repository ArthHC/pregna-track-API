import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParityDto {
  @ApiProperty({
    description: 'ID da paciente',
    example: 1
  })
  @IsNotEmpty()
  @IsInt()
  patient_id: number;

  @ApiProperty({
    description: 'Número de gestações',
    example: 1,
    minimum: 0
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  gestations: number;

  @ApiProperty({
    description: 'Número de partos vaginais',
    example: 0,
    minimum: 0
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  births_vaginal: number;

  @ApiProperty({
    description: 'Número de partos cesáreas',
    example: 0,
    minimum: 0
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  births_cesarean: number;

  @ApiProperty({
    description: 'Número de abortos',
    example: 0,
    minimum: 0
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  abortions: number;
}