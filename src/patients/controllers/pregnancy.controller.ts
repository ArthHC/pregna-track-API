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
import { PregnancyService } from '../services/pregnancy.service';
import { CreatePregnancyDto } from '../dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from '../dto/update-pregnancy.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('🤰 Pregnancies')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('pregnancies')
export class PregnancyController {
  constructor(private readonly pregnancyService: PregnancyService) {}

  @ApiOperation({
    summary: 'Criar nova gestação',
    description: 'Registra uma nova gestação para uma paciente',
  })
  @Post()
  create(@Body() createPregnancyDto: CreatePregnancyDto) {
    return this.pregnancyService.create(createPregnancyDto);
  }

  @ApiOperation({
    summary: 'Listar todas as gestações',
    description: 'Retorna lista de todas as gestações',
  })
  @Get()
  findAll() {
    return this.pregnancyService.findAll();
  }

  @ApiOperation({
    summary: 'Buscar gestações por paciente',
    description: 'Retorna gestações de uma paciente específica',
  })
  @ApiParam({ name: 'patientId', description: 'ID da paciente' })
  @Get('patient/:patientId')
  findByPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.pregnancyService.findByPatientId(patientId);
  }

  @ApiOperation({
    summary: 'Buscar gestação por ID',
    description: 'Retorna dados de uma gestação específica',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pregnancyService.findOne(id);
  }

  @ApiOperation({
    summary: 'Atualizar gestação',
    description: 'Atualiza dados de uma gestação',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePregnancyDto: UpdatePregnancyDto,
  ) {
    return this.pregnancyService.update(id, updatePregnancyDto);
  }

  @ApiOperation({
    summary: 'Deletar gestação',
    description: 'Remove uma gestação do sistema',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pregnancyService.remove(id);
  }
}
