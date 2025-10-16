import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from 'src/patients/patient.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { EmailService } from 'src/notifications/email.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepo: Repository<Patient>,
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * 🕘 Normal mod: Her gün sabah 9:00’da otomatik çalışır.
   * (Test modu olan 30 saniyelik cron kaldırıldı)
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleCron() {
    this.logger.verbose('⏰ Günlük cron job (09:00) çalıştı...');
    await this.checkUpcomingControls();
  }

  /**
   * Yaklaşan kontrolleri kontrol eder (önümüzdeki 3 gün içinde)
   */
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

      const report = patients
        .map((p) => `${p.name} (${p.clinic.name}) - ${p.nextControlDate}`)
        .join('\n');

      // 🖥️ Masaüstü bildirimi
      this.notificationsService.sendNotification('Kontrol Yaklaşıyor', `${patients.length} hasta`);

      // 📧 E-posta bildirimi
      await this.emailService.sendEmail(
        'nursenaalbayrak57@gmail.com',
        'Yaklaşan Kontroller',
        report,
      );
    } else {
      this.logger.log('Bugün kontrolü olan hasta yok ✅');
    }
  }
}
