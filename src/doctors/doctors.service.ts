import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto) {
    return this.prisma.doctor.create({
      data: createDoctorDto,
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

    return this.prisma.doctor.update({
      where: { id },
      data: updateDoctorDto,
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
}
