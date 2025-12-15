import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PregnancyService } from './services/pregnancy.service';
import { ParityService } from './services/parity.service';
import { PregnancyController } from './controllers/pregnancy.controller';
import { ParityController } from './controllers/parity.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PatientsController, PregnancyController, ParityController],
  providers: [PatientsService, PregnancyService, ParityService],
  exports: [PatientsService, PregnancyService, ParityService],
})
export class PatientsModule {}
