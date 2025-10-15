import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ClinicModule } from './clinics/clinics.module';
import { PatientsModule } from './patients/patients.module';
import { PhotosModule } from './photos/photos.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'clinic.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ScheduleModule.forRoot(), // ✅ cron job'lar için
    ClinicModule,
    PatientsModule,
    PhotosModule,
    SettingsModule,
  ],
})
export class AppModule {}
