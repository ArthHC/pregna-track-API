import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePregnancyDto } from '../dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from '../dto/update-pregnancy.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PregnancyService {
  constructor(private prisma: PrismaService) {}

  async create(createPregnancyDto: CreatePregnancyDto) {
    const { edd, baby_birth_date, ...rest } = createPregnancyDto;

    const createData: any = { ...rest };

    createData.edd = new Date(edd);

    if (baby_birth_date) {
      createData.baby_birth_date = new Date(baby_birth_date);
    }

    if (!createData.status) {
      createData.status = 'Em acompanhamento';
    }

    return this.prisma.pregnancy.create({
      data: createData,
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
    return this.prisma.pregnancy.findMany({
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
    return this.prisma.pregnancy.findMany({
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
    const pregnancy = await this.prisma.pregnancy.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            doctor: true,
          },
        },
      },
    });

    if (!pregnancy) {
      throw new NotFoundException(`Pregnancy with ID ${id} not found`);
    }

    return pregnancy;
  }

  async update(id: number, updatePregnancyDto: UpdatePregnancyDto) {
    const { edd, baby_birth_date, ...rest } = updatePregnancyDto;

    const updateData: any = { ...rest };

    if (edd) {
      updateData.edd = new Date(edd);
    }

    if (baby_birth_date) {
      updateData.baby_birth_date = new Date(baby_birth_date);
    }

    try {
      return await this.prisma.pregnancy.update({
        where: { id },
        data: updateData,
        include: {
          patient: {
            include: {
              doctor: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Pregnancy with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.pregnancy.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Pregnancy with ID ${id} not found`);
    }
  }
}
