import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicModule } from './clinics/clinic.module';
import { PatientsModule } from './patients/patients.module';
import { PhotosModule } from './photos/photos.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SettingsModule } from './settings/settings.module';
import { ScheduleModule as NestSchedule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'clinic_data.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    NestSchedule.forRoot(),
    ClinicModule,
    PatientsModule,
    PhotosModule,
    ScheduleModule,
    SettingsModule,
  ],
})
export class AppModule {}
