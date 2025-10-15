import { Injectable, Logger } from '@nestjs/common';
import * as notifier from 'node-notifier';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  sendNotification(title: string, message: string) {
    notifier.notify({
      title,
      message,
      sound: true, // 🔊 Windows/Mac sesli bildirim
      wait: false,
    });

    this.logger.log(`🔔 Bildirim gönderildi: ${title} - ${message}`);
  }
}
