import { Injectable, Logger } from '@nestjs/common';
// import * as notifier from 'node-notifier';  // bunu kaldır
const notifier = require('node-notifier'); // bunu kullan

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  sendNotification(title: string, message: string) {
    try {
      // ✅ bazı ortamlarda notify fonksiyonunu doğrudan almak gerekiyor
      const notifyFn = notifier.notify || (notifier.default && notifier.default.notify);

      if (notifyFn) {
        notifyFn({
          title,
          message,
          sound: true,
        });
        this.logger.log(`🔔 Bildirim gönderildi: ${title}`);
      } else {
        this.logger.warn('⚠️ notifier.notify fonksiyonu bulunamadı');
      }
    } catch (err) {
      this.logger.error('Bildirim gönderme hatası:', err);
    }
  }
}
