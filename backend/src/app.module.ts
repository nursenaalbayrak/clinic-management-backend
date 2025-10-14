import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClinicsModule } from './clinics/clinics.module';
import { PatientsModule } from './patients/patients.module';
import { PhotosModule } from './photos/photos.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [ClinicsModule, PatientsModule, PhotosModule, ScheduleModule, SettingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
