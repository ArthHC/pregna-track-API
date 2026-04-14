import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateParityDto } from '../dto/create-parity.dto';
import { UpdateParityDto } from '../dto/update-parity.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ParityService {
  constructor(private prisma: PrismaService) {}

  async create(createParityDto: CreateParityDto) {
    return this.prisma.parity.create({
      data: createParityDto,
      include: {
        patient: {
          include: {
            doctor: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.parity.findMany({
      include: {
        patient: {
          include: {
            doctor: true,
          },
        },
      },
    });
  }

  async findByPatientId(patientId: number) {
    return this.prisma.parity.findMany({
      where: { patient_id: patientId },
      include: {
        patient: {
          include: {
            doctor: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const parity = await this.prisma.parity.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            doctor: true,
          },
        },
      },
    });

    if (!parity) {
      throw new NotFoundException(`Parity with ID ${id} not found`);
    }

    return parity;
  }

  async update(id: number, updateParityDto: UpdateParityDto) {
    try {
      return await this.prisma.parity.update({
        where: { id },
        data: updateParityDto,
        include: {
          patient: {
            include: {
              doctor: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Parity with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.parity.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Parity with ID ${id} not found`);
    }
  }
}