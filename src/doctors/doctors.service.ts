import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);
    
    return this.prisma.doctor.create({
      data: {
        ...createDoctorDto,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return this.prisma.doctor.findMany({
      include: {
        patients: true,
        notifications: true,
      },
    });
  }

  async findOne(id: number) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        patients: true,
        notifications: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException(`Doutor com o ID ${id} não encontrado`);
    }

    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(`Doutor com o ID ${id} não encontrado`);
    }

    const updateData = { ...updateDoctorDto };
    
    if (updateDoctorDto.password) {
      updateData.password = await bcrypt.hash(updateDoctorDto.password, 10);
    }

    return this.prisma.doctor.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException(`Doutor com o ID ${id} não encontrado`);
    }

    return this.prisma.doctor.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.doctor.findUnique({
      where: { email },
    });
  }
}
