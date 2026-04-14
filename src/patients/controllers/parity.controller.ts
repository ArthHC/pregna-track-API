import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ParityService } from '../services/parity.service';
import { CreateParityDto } from '../dto/create-parity.dto';
import { UpdateParityDto } from '../dto/update-parity.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('👶 Parity')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('parity')
export class ParityController {
  constructor(private readonly parityService: ParityService) {}

  @ApiOperation({
    summary: 'Registrar paridade',
    description: 'Registra informações de paridade para uma paciente',
  })
  @Post()
  create(@Body() createParityDto: CreateParityDto) {
    return this.parityService.create(createParityDto);
  }

  @ApiOperation({
    summary: 'Listar todas as paridades',
    description: 'Retorna lista de todas as paridades',
  })
  @Get()
  findAll() {
    return this.parityService.findAll();
  }

  @ApiOperation({
    summary: 'Buscar paridade por paciente',
    description: 'Retorna paridades de uma paciente específica',
  })
  @ApiParam({ name: 'patientId', description: 'ID da paciente' })
  @Get('patient/:patientId')
  findByPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.parityService.findByPatientId(patientId);
  }

  @ApiOperation({
    summary: 'Buscar paridade por ID',
    description: 'Retorna dados de uma paridade específica',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parityService.findOne(id);
  }

  @ApiOperation({
    summary: 'Atualizar paridade',
    description: 'Atualiza dados de paridade',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParityDto: UpdateParityDto,
  ) {
    return this.parityService.update(id, updateParityDto);
  }

  @ApiOperation({
    summary: 'Deletar paridade',
    description: 'Remove uma paridade do sistema',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.parityService.remove(id);
  }
}
