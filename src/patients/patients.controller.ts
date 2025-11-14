import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UsePipes, ValidationPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('🤰 Patients')
@Controller('patients')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @ApiOperation({
    summary: 'Criar nova paciente',
    description: 'Cadastra uma nova paciente no sistema. Campos opcionais: babyName, dateOfBirth, color, parity, observation.'
  })
  @ApiBody({
    type: CreatePatientDto,
    examples: {
      complete: {
        summary: 'Paciente completa',
        description: 'Exemplo com todos os campos preenchidos',
        value: {
          name: 'Maria',
          babyName: 'Pedro',
          dateOfBirth: '1990-05-15',
          color: 'FF5733',
          EDD: '2025-06-01',
          assistanceDaysBeforeEDD: 30,
          assistanceDaysAfterEDD: 15,
          parity: 'G1P0',
          observation: 'Primeira gestação',
          doctorId: 1
        }
      },
      minimal: {
        summary: 'Paciente mínima',
        description: 'Exemplo com apenas campos obrigatórios',
        value: {
          name: 'Ana',
          EDD: '2025-07-15',
          assistanceDaysBeforeEDD: 20,
          assistanceDaysAfterEDD: 10,
          doctorId: 1
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Paciente criada com sucesso',
    example: {
      id: 1,
      name: 'Maria',
      babyName: 'Pedro',
      dateOfBirth: '1990-05-15T00:00:00.000Z',
      EDD: '2025-06-01T00:00:00.000Z',
      assistanceDaysBeforeEDD: 30,
      assistanceDaysAfterEDD: 15,
      parity: 'G1P0',
      observation: 'Primeira gestação',
      doctorId: 1,
      doctor: {
        id: 1,
        name: 'Dr. João',
        email: 'joao@email.com'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @ApiOperation({
    summary: 'Listar pacientes',
    description: 'Lista todas as pacientes ou filtra por médico usando o query parameter doctorId'
  })
  @ApiQuery({
    name: 'doctorId',
    description: 'ID do médico para filtrar pacientes',
    required: false,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pacientes',
    example: [{
      id: 1,
      name: 'Maria',
      babyName: 'Pedro',
      EDD: '2025-06-01T00:00:00.000Z',
      assistanceDaysBeforeEDD: 30,
      assistanceDaysAfterEDD: 15,
      doctorId: 1,
      doctor: {
        id: 1,
        name: 'Dr. João'
      }
    }]
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @Get()
  findAll(@Query('doctorId') doctorId?: string) {
    if (doctorId) {
      return this.patientsService.findByDoctor(parseInt(doctorId));
    }
    return this.patientsService.findAll();
  }

  @ApiOperation({
    summary: 'Buscar paciente por ID',
    description: 'Retorna uma paciente específica com informações do médico responsável'
  })
  @ApiParam({ name: 'id', description: 'ID da paciente', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Paciente encontrada',
    example: {
      id: 1,
      name: 'Maria',
      babyName: 'Pedro',
      dateOfBirth: '1990-05-15T00:00:00.000Z',
      EDD: '2025-06-01T00:00:00.000Z',
      assistanceDaysBeforeEDD: 30,
      assistanceDaysAfterEDD: 15,
      parity: 'G1P0',
      observation: 'Primeira gestação',
      doctorId: 1,
      doctor: {
        id: 1,
        name: 'Dr. João',
        email: 'joao@email.com'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Atualizar paciente',
    description: 'Atualiza dados de uma paciente. Todos os campos são opcionais na atualização.'
  })
  @ApiParam({ name: 'id', description: 'ID da paciente', example: 1 })
  @ApiBody({
    type: UpdatePatientDto,
    examples: {
      edd_update: {
        summary: 'Atualizar EDD',
        description: 'Exemplo atualizando data prevista de parto',
        value: {
          EDD: '2025-08-01',
          observation: 'Data atualizada após ultrassom'
        }
      },
      partial: {
        summary: 'Atualização parcial',
        description: 'Exemplo atualizando alguns campos',
        value: {
          name: 'Maria Silva',
          assistanceDaysBeforeEDD: 35,
          observation: 'Acompanhamento intensivo'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente atualizada com sucesso',
    example: {
      id: 1,
      name: 'Maria Silva',
      EDD: '2025-08-01T00:00:00.000Z',
      observation: 'Data atualizada após ultrassom',
      doctor: {
        id: 1,
        name: 'Dr. João'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrada' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @ApiOperation({
    summary: 'Deletar paciente',
    description: 'Remove uma paciente do sistema permanentemente'
  })
  @ApiParam({ name: 'id', description: 'ID da paciente', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Paciente deletada com sucesso',
    example: {
      id: 1,
      name: 'Maria',
      babyName: 'Pedro'
    }
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrada' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }
}
