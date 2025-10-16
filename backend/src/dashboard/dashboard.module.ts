import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Patient } from 'src/patients/patient.entity';
import { Clinic } from 'src/clinics/clinic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Clinic])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
