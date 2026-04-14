import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
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
    description:
      'Cadastra uma nova paciente no sistema. Apenas dados básicos da paciente.',
  })
  @ApiBody({
    type: CreatePatientDto,
    examples: {
      complete: {
        summary: 'Paciente completa',
        description: 'Exemplo com todos os campos preenchidos',
        value: {
          doctor_id: 1,
          name: 'Maria Santos',
          date_of_birth: '1990-05-15',
          phone_number: '11999888777',
          badge_color: '#FF5733',
        },
      },
      minimal: {
        summary: 'Paciente básica',
        description: 'Exemplo com apenas campos obrigatórios',
        value: {
          doctor_id: 1,
          name: 'Ana Silva',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Paciente criada com sucesso',
    example: {
      id: 1,
      doctor_id: 1,
      name: 'Maria Santos',
      date_of_birth: '1990-05-15T00:00:00.000Z',
      phone_number: '11999888777',
      badge_color: '#FF5733',
      doctor: {
        id: 1,
        name: 'Dr. João',
        email: 'joao@email.com',
      },
      pregnancies: [],
      parities: [],
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @ApiOperation({
    summary: 'Listar pacientes',
    description: 'Lista todas as pacientes ou filtra por médico específico',
  })
  @ApiQuery({
    name: 'doctorId',
    required: false,
    description: 'ID do médico para filtrar pacientes',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pacientes',
    example: [
      {
        id: 1,
        doctor_id: 1,
        name: 'Maria Santos',
        date_of_birth: '1990-05-15T00:00:00.000Z',
        phone_number: '11999888777',
        badge_color: '#FF5733',
        doctor: {
          id: 1,
          name: 'Dr. João',
        },
        pregnancies: [],
        parities: [],
      },
    ],
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @Get()
  findAll(@Query('doctorId') doctorId?: string) {
    if (doctorId) {
      return this.patientsService.findByDoctorId(+doctorId);
    }
    return this.patientsService.findAll();
  }

  @ApiOperation({
    summary: 'Buscar paciente por ID',
    description:
      'Retorna dados completos de uma paciente específica incluindo gestações e paridades',
  })
  @ApiParam({ name: 'id', description: 'ID da paciente', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Paciente encontrada',
    example: {
      id: 1,
      doctor_id: 1,
      name: 'Maria Santos',
      date_of_birth: '1990-05-15T00:00:00.000Z',
      phone_number: '11999888777',
      badge_color: '#FF5733',
      doctor: {
        id: 1,
        name: 'Dr. João',
        email: 'joao@email.com',
      },
      pregnancies: [
        {
          id: 1,
          baby_name: 'Pedro',
          edd: '2025-06-01T00:00:00.000Z',
          status: 'Em acompanhamento',
        },
      ],
      parities: [
        {
          id: 1,
          gestations: 1,
          births_vaginal: 0,
          births_cesarean: 0,
          abortions: 0,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Atualizar paciente',
    description:
      'Atualiza dados básicos de uma paciente (não inclui dados de gestação ou paridade)',
  })
  @ApiParam({ name: 'id', description: 'ID da paciente', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Paciente atualizada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrada' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @ApiOperation({
    summary: 'Deletar paciente',
    description:
      'Remove uma paciente do sistema (cascade: remove gestações e paridades associadas)',
  })
  @ApiParam({ name: 'id', description: 'ID da paciente', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Paciente deletada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrada' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }
}
