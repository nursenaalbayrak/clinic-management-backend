import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Gmail kullanıyorsan
      auth: {
        user: process.env.MAIL_USER, // .env dosyasında tanımlanacak
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: `"Clinic Manager" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
      });

      this.logger.log(`📧 Mail gönderildi: ${to}`);
    } catch (error) {
      this.logger.error('❌ Mail gönderimi başarısız:', error.message);
    }
  }
}
