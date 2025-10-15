import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from './clinic.entity';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepo: Repository<Clinic>,
  ) {}

  findAll() {
    return this.clinicRepo.find();
  }

  async create(name: string) {
    const clinic = this.clinicRepo.create({ name });
    return this.clinicRepo.save(clinic);
  }

  async remove(id: number) {
    await this.clinicRepo.delete(id);
    return { deleted: true };
  }
}
