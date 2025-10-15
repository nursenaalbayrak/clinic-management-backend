import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleFeatureModule } from './schedule/schedule.module';
import { PatientsModule } from './patients/patients.module';
import { PhotosModule } from './photos/photos.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ClinicModule } from './clinics/clinic.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'clinic.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ScheduleFeatureModule, // ✅ cron job'lar için
    ClinicModule,
    PatientsModule,
    PhotosModule,
    SettingsModule,
    NotificationsModule, // bildirim servisi için

  ],
})
export class AppModule {}
