import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsService],
  exports: [NotificationsService], // diğer modüller de kullanabilsin
})
export class NotificationsModule {}
