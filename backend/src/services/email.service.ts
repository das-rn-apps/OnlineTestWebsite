import nodemailer from 'nodemailer';
import logger from './logger.service';

class EmailService {
    private transporter;
    private isDev: boolean;

    constructor() {
        this.isDev = process.env.NODE_ENV !== 'production';

        // In a real scenario, use actual credits. For now use ethereal or mock.
        // Or if config is available use it.
        // Assuming config has email credentials structure, or we mock it.

        // This is a placeholder setup
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER || 'ethereal_user',
                pass: process.env.SMTP_PASS || 'ethereal_pass',
            },
        });
    }

    async sendEmail(to: string, subject: string, html: string) {
        if (this.isDev) {
            logger.info(`[EmailService] Mock sending email to ${to} with subject: ${subject}`);
            return;
        }

        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"Test Platform" <noreply@testplatform.com>',
                to,
                subject,
                html,
            });
            logger.info(`Email sent: ${info.messageId}`);
        } catch (error) {
            logger.error('Error sending email', error);
        }
    }

    async sendWelcomeEmail(to: string, name: string) {
        const subject = 'Welcome to Test Series Platform';
        const html = `<h1>Welcome ${name}!</h1><p>Thank you for registering.</p>`;
        await this.sendEmail(to, subject, html);
    }
}

export default new EmailService();
