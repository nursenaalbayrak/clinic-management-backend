import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { Patient } from 'src/patients/patient.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    NotificationsModule,
    NestScheduleModule.forRoot(), // ⚠️ alias ile kullanıyoruz
  ],
  providers: [ScheduleService],
})
export class ScheduleFeatureModule {} // ✅ çakışmayı önledik
