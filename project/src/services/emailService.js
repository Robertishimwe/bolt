const nodemailer = require('nodemailer');
const Queue = require('../utils/queue');
const logger = require('../utils/logger');

class EmailService {
  static async sendWelcomeEmail(email, name) {
    const emailData = {
      to: email,
      subject: 'Welcome to Survey API',
      template: 'welcome',
      context: { name }
    };

    await Queue.add('email', emailData);
  }

  static async processEmail(emailData) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        ...emailData
      });

      logger.info({ email: emailData.to }, 'Email sent successfully');
    } catch (error) {
      logger.error(error, 'Failed to send email');
      throw error;
    }
  }
}

module.exports = { EmailService };