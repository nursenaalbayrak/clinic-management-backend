import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { Patient } from 'src/patients/patient.entity';
import { unlink } from 'fs/promises';
import { join } from 'path';

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
  const photo = await this.photoRepo.findOne({ where: { id }, relations: ['patient'] });
  if (!photo) throw new Error('Fotoğraf bulunamadı');

  try {
    // 📁 Dosya yolunu oluştur
    const filePath = join(process.cwd(), photo.path);

    // 🗑️ Fiziksel dosyayı sil
    await unlink(filePath);
  } catch (err) {
    console.warn('⚠️ Dosya zaten silinmiş olabilir:', err.message);
  }

  // 🧹 Veritabanı kaydını sil
  await this.photoRepo.delete(id);

  return { message: 'Fotoğraf başarıyla silindi', id };
}


}
