import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from 'src/patients/patient.entity';
@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepo: Repository<Patient>,
  ) {}

  // 🔹 Her gün sabah 09:00'da çalışır
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkUpcomingControls() {
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const todayStr = today.toISOString().split('T')[0];
    const threeDaysLaterStr = threeDaysLater.toISOString().split('T')[0];

    const patients = await this.patientsRepo
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.clinic', 'clinic')
      .where('patient.nextControlDate BETWEEN :today AND :limit', {
        today: todayStr,
        limit: threeDaysLaterStr,
      })
      .getMany();

    if (patients.length > 0) {
      this.logger.warn(
        `📅 Yaklaşan kontroller bulundu: ${patients.length} hasta`,
      );
      patients.forEach((p) => {
        this.logger.log(
          `🔔 ${p.name} (${p.clinic.name}) - Kontrol Tarihi: ${p.nextControlDate}`,
        );
      });
    } else {
      this.logger.log('Bugün veya yakında kontrolü olan hasta yok ✅');
    }
  }
}
