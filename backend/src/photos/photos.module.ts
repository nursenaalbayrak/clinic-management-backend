import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { Photo } from './photo.entity';
import { Patient } from 'src/patients/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, Patient])],
  controllers: [PhotosController], // 👈 Burası çok önemli!
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
