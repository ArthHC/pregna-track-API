import { PartialType } from '@nestjs/swagger';
import { CreatePregnancyDto } from './create-pregnancy.dto';

export class UpdatePregnancyDto extends PartialType(CreatePregnancyDto) {}
