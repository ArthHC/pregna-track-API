import { PartialType } from '@nestjs/swagger';
import { CreateParityDto } from './create-parity.dto';

export class UpdateParityDto extends PartialType(CreateParityDto) {}
