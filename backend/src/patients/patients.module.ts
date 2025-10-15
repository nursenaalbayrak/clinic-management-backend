import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Patient } from './patient.entity';
import { Clinic } from 'src/clinics/clinic.entity'; // ✅ ekle

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Clinic])], // ✅ Clinic eklendi
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
