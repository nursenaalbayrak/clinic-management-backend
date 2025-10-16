import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from 'src/patients/patient.entity';
import { Clinic } from 'src/clinics/clinic.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Clinic)
    private readonly clinicRepo: Repository<Clinic>,
  ) {}

  async getClinicStats(clinicId: number) {
    const patients = await this.patientRepo.find({ where: { clinic: { id: clinicId } } });

    const totalPatients = patients.length;
    const totalPaid = patients.reduce((sum, p) => sum + (p.paid || 0), 0);
    const totalRemaining = patients.reduce((sum, p) => sum + (p.remaining || 0), 0);

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingControls = patients.filter((p) => {
      const date = p.nextControlDate ? new Date(p.nextControlDate) : null;
      return date && date >= today && date <= nextWeek;
    }).length;

    return {
      clinicId,
      totalPatients,
      totalPaid,
      totalRemaining,
      upcomingControls,
    };
  }

  async getAllClinicsOverview() {
    const clinics = await this.clinicRepo.find({ relations: ['patients'] });
    return Promise.all(
      clinics.map(async (clinic) => ({
        id: clinic.id,
        name: clinic.name,
        stats: await this.getClinicStats(clinic.id),
      })),
    );
  }
}
