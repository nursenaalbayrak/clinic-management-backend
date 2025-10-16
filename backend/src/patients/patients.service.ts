import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Patient } from './patient.entity';
import { Clinic } from 'src/clinics/clinic.entity';
import { join } from 'path';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepo: Repository<Patient>,
    @InjectRepository(Clinic)
    private readonly clinicsRepo: Repository<Clinic>,
  ) {}

  // 🔹 1. Listeleme + Filtreleme
  async findAll(query: any) {
    const where: any = {};

    if (query.clinicId) {
      where.clinic = { id: +query.clinicId };
    }

    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }

    return this.patientsRepo.find({
      where,
      relations: ['clinic'],
      order: { createdAt: 'DESC' },
    });
  }

  // 🔹 2. Tek hasta bul
  async findOne(id: number) {
    const patient = await this.patientsRepo.findOne({
      where: { id },
      relations: ['clinic'],
    });
    if (!patient) throw new NotFoundException('Hasta bulunamadı');
    return patient;
  }

  // 🔹 3. Hasta ekleme
  async create(data: any) {
    const clinic = await this.clinicsRepo.findOne({ where: { id: data.clinicId } });
    if (!clinic) throw new BadRequestException('Klinik bulunamadı');

    const nextControlDate = this.calculateNextControl(
      data.procedure,
      data.treatmentDate,
    );

    const patient = this.patientsRepo.create({
      ...data,
      nextControlDate,
      clinic,
    }) as unknown as Patient; // 🔹 TypeScript karışmasın diye açık tip dönüşümü

    (patient as Patient).remaining =
      (data.totalPrice ?? 0) - (data.paid ?? 0);

    return this.patientsRepo.save(patient);
  }

  // 🔹 4. Güncelleme
  async update(id: number, data: Partial<Patient>) {
    const patient = await this.findOne(id);

    if (data.procedure || data.treatmentDate) {
      const newProcedure = data.procedure || patient.procedure;
      const newDate = data.treatmentDate || patient.treatmentDate;
      patient.nextControlDate = this.calculateNextControl(newProcedure, newDate);
    }

    Object.assign(patient, data);
    (patient as Patient).remaining =
      (patient.price?? 0) - (patient.paid ?? 0);

    return this.patientsRepo.save(patient);
  }

  // 🔹 5. Silme
  async remove(id: number) {
    const result = await this.patientsRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Silinecek hasta bulunamadı');
    return { deleted: true };
  }

  // 🔹 6. Otomatik kontrol tarihi hesaplama
  private calculateNextControl(procedure: string, treatmentDate: string): string {
    const baseDate = new Date(treatmentDate);
    let monthsToAdd = 3;

    const lower = procedure.toLowerCase();
    if (lower.includes('botox') || lower.includes('btx')) monthsToAdd = 2;
    else if (lower.includes('dolgu') || lower.includes('filler')) monthsToAdd = 6;
    else if (lower.includes('mezoterapi')) monthsToAdd = 1;

    baseDate.setMonth(baseDate.getMonth() + monthsToAdd);
    return baseDate.toISOString().split('T')[0];
  }
async getPatientDetails(id: number) {
  const patient = await this.patientsRepo.findOne({
    where: { id },
    relations: ['clinic', 'photos'], // ilişkiler (clinic + photos)
  });

  if (!patient) {
    throw new Error('Hasta bulunamadı');
  }

  return {
    id: patient.id,
    name: patient.name,
    procedure: patient.procedure,
    treatmentDate: patient.treatmentDate,
    price: patient.price,
    paid: patient.paid,
    remaining: patient.remaining,
    clinic: patient.clinic ? patient.clinic.name : null,
    nextControlDate: patient.nextControlDate,
    photos: patient.photos?.map((p) => ({
      id: p.id,
      path: p.path,
      description: p.description,
      uploadedAt: p.createdAt,
      url: `http://localhost:3000/uploads/${p.path.split('\\').pop()}`,
    })),
  };
}

}
