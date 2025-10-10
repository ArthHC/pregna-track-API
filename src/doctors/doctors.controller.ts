import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('👨‍⚕️ Doctors')
@Controller('doctors')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @ApiOperation({
    summary: 'Registrar novo médico',
    description: 'Cria um novo médico no sistema. A senha é automaticamente criptografada com bcrypt. Endpoint público para registro inicial.'
  })
  @ApiBody({
    type: CreateDoctorDto,
    examples: {
      doctor: {
        summary: 'Médico completo',
        description: 'Exemplo com todos os campos',
        value: {
          name: 'Dr. João',
          surname: 'Silva',
          email: 'joao.silva@email.com',
          password: '123456789'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Médico criado com sucesso',
    example: {
      id: 1,
      name: 'Dr. João',
      surname: 'Silva',
      email: 'joao.silva@email.com'
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email já existe',
    example: {
      statusCode: 400,
      message: 'Email já está em uso'
    }
  })
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @ApiOperation({
    summary: 'Listar todos os médicos',
    description: 'Retorna lista completa de médicos com seus pacientes e notificações'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Lista de médicos',
    example: [{
      id: 1,
      name: 'Dr. João',
      surname: 'Silva',
      email: 'joao.silva@email.com',
      patients: [],
      notifications: []
    }]
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @ApiOperation({
    summary: 'Buscar médico por ID',
    description: 'Retorna um médico específico com seus pacientes e notificações'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID do médico', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Médico encontrado',
    example: {
      id: 1,
      name: 'Dr. João',
      surname: 'Silva',
      email: 'joao.silva@email.com',
      patients: [],
      notifications: []
    }
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @ApiResponse({ status: 404, description: 'Médico não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Atualizar médico',
    description: 'Atualiza dados de um médico. Se a senha for fornecida, será criptografada automaticamente.'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID do médico', example: 1 })
  @ApiBody({
    type: UpdateDoctorDto,
    examples: {
      partial: {
        summary: 'Atualização parcial',
        description: 'Exemplo atualizando apenas nome',
        value: {
          name: 'Dr. João Carlos'
        }
      },
      complete: {
        summary: 'Atualização completa',
        description: 'Exemplo atualizando todos os campos',
        value: {
          name: 'Dr. João Carlos',
          surname: 'Silva Santos',
          email: 'joao.carlos@email.com'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Médico atualizado com sucesso',
    example: {
      id: 1,
      name: 'Dr. João Carlos',
      surname: 'Silva Santos',
      email: 'joao.carlos@email.com'
    }
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @ApiResponse({ status: 404, description: 'Médico não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @ApiOperation({
    summary: 'Deletar médico',
    description: 'Remove um médico do sistema permanentemente'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID do médico', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Médico deletado com sucesso',
    example: {
      id: 1,
      name: 'Dr. João',
      surname: 'Silva',
      email: 'joao.silva@email.com'
    }
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido' })
  @ApiResponse({ status: 404, description: 'Médico não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.remove(id);
  }
}
