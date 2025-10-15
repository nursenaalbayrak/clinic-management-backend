import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from 'src/patients/patient.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepo: Repository<Patient>,
    private readonly notificationsService: NotificationsService,
  ) {}

  // 🔁 Her 30 saniyede bir çalışır (test amaçlı)
@Cron(CronExpression.EVERY_30_SECONDS)
handleCron() {
  this.logger.verbose('⏰ Cron job çalıştı...');
  this.checkUpcomingControls();
}


  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkUpcomingControls() {
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const todayStr = today.toISOString().split('T')[0];
    const threeDaysLaterStr = threeDaysLater.toISOString().split('T')[0];

    const patients = await this.patientsRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.clinic', 'clinic')
      .where('p.nextControlDate BETWEEN :today AND :limit', {
        today: todayStr,
        limit: threeDaysLaterStr,
      })
      .getMany();

    if (patients.length > 0) {
      this.logger.warn(`📅 Yaklaşan kontroller: ${patients.length} hasta`);
      patients.forEach((p) => {
        const msg = `${p.name} (${p.clinic.name}) - ${p.nextControlDate}`;
        this.notificationsService.sendNotification('Kontrol Yaklaşıyor', msg);
      });
    } else {
      this.logger.log('Bugün kontrolü olan hasta yok ✅');
    }
  }
}
