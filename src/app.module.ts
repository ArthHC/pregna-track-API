import { Module } from '@nestjs/common';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { PrismaModule } from './prisma/prisma.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [PrismaModule, DoctorsModule, PatientsModule, NotificationsModule],
})
export class AppModule {}
