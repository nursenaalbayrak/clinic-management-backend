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
  private readonly emailService: EmailService, // ✅ eklendi
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
   const oneYearLater = new Date();
oneYearLater.setFullYear(today.getFullYear() + 1);

const todayStr = today.toISOString().split('T')[0];
const oneYearLaterStr = oneYearLater.toISOString().split('T')[0];

const patients = await this.patientsRepo
  .createQueryBuilder('p')
  .leftJoinAndSelect('p.clinic', 'clinic')
  .getMany();


    if (patients.length > 0) {
  this.logger.warn(`📅 Yaklaşan kontroller: ${patients.length} hasta`);

  const report = patients
    .map((p) => `${p.name} (${p.clinic.name}) - ${p.nextControlDate}`)
    .join('\n');

  // Masaüstü bildirimi
  this.notificationsService.sendNotification('Kontrol Yaklaşıyor', `${patients.length} hasta`);

  // E-posta bildirimi
  await this.emailService.sendEmail(
    'nursenaalbayrak57@gmail.com', // test için kendi mailini yazabilirsin
    'Yaklaşan Kontroller',
    report,
  );
} else {
  this.logger.log('Bugün kontrolü olan hasta yok ✅');
}

  }
}
