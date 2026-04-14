import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto) {
    const { date_of_birth, ...rest } = createPatientDto;
    
    const createData: any = { ...rest };
    
    if (date_of_birth) {
      createData.date_of_birth = new Date(date_of_birth);
    }
    
    return this.prisma.patient.create({
      data: createData,
      include: {
        doctor: true,
        pregnancies: true,
        parities: true,
      },
    });
  }

  async findAll() {
    return this.prisma.patient.findMany({
      include: {
        doctor: true,
        pregnancies: true,
        parities: true,
      },
    });
  }

  async findByDoctorId(doctorId: number) {
    return this.prisma.patient.findMany({
      where: { doctor_id: doctorId },
      include: {
        doctor: true,
        pregnancies: true,
        parities: true,
      },
    });
  }

  async findOne(id: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        doctor: true,
        pregnancies: true,
        parities: true,
      },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const { date_of_birth, ...rest } = updatePatientDto;
    
    const updateData: any = { ...rest };
    
    if (date_of_birth) {
      updateData.date_of_birth = new Date(date_of_birth);
    }

    try {
      return await this.prisma.patient.update({
        where: { id },
        data: updateData,
        include: {
          doctor: true,
          pregnancies: true,
          parities: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.patient.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }
}