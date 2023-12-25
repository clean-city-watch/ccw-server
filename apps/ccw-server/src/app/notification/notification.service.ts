import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {

    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // Set to true if using SSL/TLS
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    
      sendEmail(to: string, subject: string, text: string) {
        const mailOptions = {
          from: process.env.SMTP_USER, // Sender email address
          to,
          subject,
          text,
        };
    
        return this.transporter.sendMail(mailOptions);
      }
}
