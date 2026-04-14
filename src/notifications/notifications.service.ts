import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notifications.dto';
import { UpdateNotificationDto } from './dto/update-notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const { date, ...rest } = createNotificationDto;
    const createData: any = { ...rest };

    if (date) {
      createData.date = new Date(date);
    } else {
      createData.date = new Date();
    }

    return this.prisma.notification.create({
      data: createData,
    });
  }

  async findAll() {
    return this.prisma.notification.findMany();
  }

  async findOne(id: number) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const { date, ...rest } = updateNotificationDto;
    const updateData: any = { ...rest };

    if (date) {
      updateData.date = new Date(date);
    }
    return this.prisma.notification.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
