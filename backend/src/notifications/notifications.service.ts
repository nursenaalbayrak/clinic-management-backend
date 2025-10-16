import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
const notifier = require('node-notifier');

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // Aynı bildirimi kısa sürede tekrar göndermeyi önlemek için
  private lastSent: Record<string, number> = {};

  sendNotification(title: string, message: string) {
    try {
      const notifyFn = notifier.notify || (notifier.default && notifier.default.notify);
      if (!notifyFn) {
        this.logger.warn('⚠️ notifier.notify fonksiyonu bulunamadı');
        return;
      }

      // spam koruması (30 saniye içinde aynı mesaj varsa tekrar gönderme)
      const key = `${title}:${message}`;
      const now = Date.now();
      if (this.lastSent[key] && now - this.lastSent[key] < 30_000) {
        this.logger.verbose(`⏳ ${title} bildirimi yakın zamanda gönderildi, atlanıyor.`);
        return;
      }
      this.lastSent[key] = now;

      notifyFn({
        title,
        message,
        sound: true,
        icon: path.join(__dirname, 'bell.png'), // istersen ikon ekleyebilirsin
      });

      this.logger.log(`🔔 Bildirim gönderildi: ${title}`);
    } catch (err) {
      this.logger.error('Bildirim gönderme hatası:', err.message);
    }
  }
}
