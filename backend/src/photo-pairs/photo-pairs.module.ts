import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoPair } from './photo-pair.entity';
import { PhotoPairsService } from './photo-pairs.service';
import { PhotoPairsController } from './photo-pairs.controller';
import { Patient } from 'src/patients/patient.entity';
import { Photo } from 'src/photos/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoPair, Patient, Photo])],
  providers: [PhotoPairsService],
  controllers: [PhotoPairsController],
  exports: [PhotoPairsService],
})
export class PhotoPairsModule {}
