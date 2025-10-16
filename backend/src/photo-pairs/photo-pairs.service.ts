import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotoPair } from './photo-pair.entity';
import { Patient } from 'src/patients/patient.entity';
import { Photo } from 'src/photos/photo.entity';
import { CreatePhotoPairDto } from './dto/create-photo-pair.dto';
import { UpdatePhotoPairDto } from './dto/update-photo-pair.dto';

@Injectable()
export class PhotoPairsService {
  constructor(
    @InjectRepository(PhotoPair) private readonly pairRepo: Repository<PhotoPair>,
    @InjectRepository(Patient)   private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Photo)     private readonly photoRepo: Repository<Photo>,
  ) {}

  async create(dto: CreatePhotoPairDto) {
    const patient = await this.patientRepo.findOne({ where: { id: dto.patientId } });
    if (!patient) throw new NotFoundException('Hasta bulunamadı');

    const before = await this.photoRepo.findOne({ where: { id: dto.beforePhotoId }, relations: ['patient'] });
    const after  = await this.photoRepo.findOne({ where: { id: dto.afterPhotoId  }, relations: ['patient'] });

    if (!before || !after) throw new NotFoundException('Fotoğraf(lar) bulunamadı');

    // iki fotoğraf da aynı hastaya ait mi?
    if (before.patient.id !== patient.id || after.patient.id !== patient.id) {
      throw new BadRequestException('Before/After fotoğrafları aynı hastaya ait olmalı');
    }

    // aynı fotoğrafı iki kez kullanma
    if (before.id === after.id) {
      throw new BadRequestException('Before ve After aynı fotoğraf olamaz');
    }

    const pair = this.pairRepo.create({
      patient,
      beforePhoto: before,
      afterPhoto: after,
      title: dto.title,
      notes: dto.notes,
    });

    return this.pairRepo.save(pair);
  }

  async listByPatient(patientId: number) {
    return this.pairRepo.find({
      where: { patient: { id: patientId } },
      order: { createdAt: 'DESC' },
    });
  }

  async get(id: number) {
    const pair = await this.pairRepo.findOne({ where: { id } });
    if (!pair) throw new NotFoundException('Eşleştirme bulunamadı');
    return pair;
  }

  async update(id: number, dto: UpdatePhotoPairDto) {
    const pair = await this.get(id);

    if (dto.beforePhotoId) {
      const before = await this.photoRepo.findOne({ where: { id: dto.beforePhotoId }, relations: ['patient'] });
      if (!before) throw new NotFoundException('Before fotoğraf bulunamadı');
      if (before.patient.id !== pair.patient.id) throw new BadRequestException('Fotoğraf aynı hastaya ait değil');
      pair.beforePhoto = before;
    }

    if (dto.afterPhotoId) {
      const after = await this.photoRepo.findOne({ where: { id: dto.afterPhotoId }, relations: ['patient'] });
      if (!after) throw new NotFoundException('After fotoğraf bulunamadı');
      if (after.patient.id !== pair.patient.id) throw new BadRequestException('Fotoğraf aynı hastaya ait değil');
      pair.afterPhoto = after;
    }

    if (dto.title !== undefined) pair.title = dto.title;
    if (dto.notes !== undefined) pair.notes = dto.notes;

    return this.pairRepo.save(pair);
  }

  async delete(id: number) {
    const pair = await this.get(id);
    await this.pairRepo.remove(pair);
    return { message: 'Eşleştirme silindi', id };
  }
}
