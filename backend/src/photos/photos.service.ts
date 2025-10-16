import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { Patient } from 'src/patients/patient.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepo: Repository<Photo>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  async addPhoto(patientId: number, filePath: string, description?: string) {
    const patient = await this.patientRepo.findOne({ where: { id: patientId } });
    if (!patient) throw new Error('Patient not found');

    const photo = this.photoRepo.create({
      path: filePath,
      description,
      patient,
    });

    return this.photoRepo.save(photo);
  }

  async getPhotosByPatient(patientId: number) {
    return this.photoRepo.find({ where: { patient: { id: patientId } } });
  }

  async deletePhoto(id: number) {
    return this.photoRepo.delete(id);
  }
}
