import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto) {
    const { dateOfBirth, EDD, babyBirthDate, pregnancyStatus, ...rest } = createPatientDto;
    
    const createData: any = { ...rest };
    
    if (dateOfBirth) {
      createData.dateOfBirth = new Date(dateOfBirth);
    }
    
    if (babyBirthDate) {
      createData.babyBirthDate = new Date(babyBirthDate);
    }

    if (!createData.pregnancyStatus) {
      createData.pregnancyStatus = 'Ativa';
    }
    createData.EDD = new Date(EDD);
    
    return this.prisma.patient.create({
      data: createData,
      include: {
        doctor: true,
      },
    });
  }

  async findAll() {
    return this.prisma.patient.findMany({
      include: {
        doctor: true,
      },
    });
  }

  async findOne(id: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        doctor: true,
      },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente com o ID ${id} não encontrado`);
    }

    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente com o ID ${id} não encontrado`);
    }

    const { dateOfBirth, EDD, babyBirthDate, ...rest } = updatePatientDto;
    const updateData: any = { ...rest };

    if (dateOfBirth) {
      updateData.dateOfBirth = new Date(dateOfBirth);
    }

    if (babyBirthDate) {
      updateData.babyBirthDate = new Date(babyBirthDate);
    }

    if (EDD) {
      updateData.EDD = new Date(EDD);
    }

    return this.prisma.patient.update({
      where: { id },
      data: updateData,
      include: {
        doctor: true,
      },
    });
  }

  async remove(id: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente com o ID ${id} não encontrado`);
    }

    return this.prisma.patient.delete({
      where: { id },
    });
  }

  async findByDoctor(doctorId: number) {
    return this.prisma.patient.findMany({
      where: { doctorId },
      include: {
        doctor: true,
      },
    });
  }
}
