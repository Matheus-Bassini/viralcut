const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          logger.error('Email transporter verification failed:', error);
        } else {
          logger.info('Email transporter is ready to send messages');
        }
      });
    } catch (error) {
      logger.error('Failed to initialize email transporter:', error);
    }
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const mailOptions = {
        from: `"ViralCut Pro" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}: ${subject}`);
      return result;
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  async sendVerificationEmail(user, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const translations = {
      'pt-BR': {
        subject: 'Verifique seu email - ViralCut Pro',
        greeting: `Olá ${user.firstName}!`,
        message: 'Obrigado por se registrar no ViralCut Pro! Para completar seu cadastro, clique no botão abaixo para verificar seu email:',
        buttonText: 'Verificar Email',
        alternativeText: 'Se o botão não funcionar, copie e cole este link no seu navegador:',
        expiryText: 'Este link expira em 24 horas.',
        footerText: 'Se você não criou uma conta no ViralCut Pro, ignore este email.',
        teamSignature: 'Equipe ViralCut Pro'
      },
      'en': {
        subject: 'Verify your email - ViralCut Pro',
        greeting: `Hello ${user.firstName}!`,
        message: 'Thank you for registering with ViralCut Pro! To complete your registration, click the button below to verify your email:',
        buttonText: 'Verify Email',
        alternativeText: 'If the button doesn\'t work, copy and paste this link into your browser:',
        expiryText: 'This link expires in 24 hours.',
        footerText: 'If you didn\'t create an account with ViralCut Pro, please ignore this email.',
        teamSignature: 'ViralCut Pro Team'
      },
      'es': {
        subject: 'Verifica tu email - ViralCut Pro',
        greeting: `¡Hola ${user.firstName}!`,
        message: '¡Gracias por registrarte en ViralCut Pro! Para completar tu registro, haz clic en el botón de abajo para verificar tu email:',
        buttonText: 'Verificar Email',
        alternativeText: 'Si el botón no funciona, copia y pega este enlace en tu navegador:',
        expiryText: 'Este enlace expira en 24 horas.',
        footerText: 'Si no creaste una cuenta en ViralCut Pro, ignora este email.',
        teamSignature: 'Equipo ViralCut Pro'
      }
    };

    const t = translations[user.language] || translations['pt-BR'];

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ViralCut Pro</div>
          </div>
          <div class="content">
            <h2>${t.greeting}</h2>
            <p>${t.message}</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">${t.buttonText}</a>
            </div>
            <p>${t.alternativeText}</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">
              ${verificationUrl}
            </p>
            <p><strong>${t.expiryText}</strong></p>
            <div class="footer">
              <p>${t.footerText}</p>
              <p>${t.teamSignature}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(user.email, t.subject, html);
  }

  async sendPasswordResetEmail(user, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const translations = {
      'pt-BR': {
        subject: 'Redefinir senha - ViralCut Pro',
        greeting: `Olá ${user.firstName}!`,
        message: 'Você solicitou a redefinição da sua senha no ViralCut Pro. Clique no botão abaixo para criar uma nova senha:',
        buttonText: 'Redefinir Senha',
        alternativeText: 'Se o botão não funcionar, copie e cole este link no seu navegador:',
        expiryText: 'Este link expira em 1 hora.',
        securityText: 'Se você não solicitou esta redefinição, ignore este email. Sua senha permanecerá inalterada.',
        teamSignature: 'Equipe ViralCut Pro'
      },
      'en': {
        subject: 'Reset your password - ViralCut Pro',
        greeting: `Hello ${user.firstName}!`,
        message: 'You requested a password reset for your ViralCut Pro account. Click the button below to create a new password:',
        buttonText: 'Reset Password',
        alternativeText: 'If the button doesn\'t work, copy and paste this link into your browser:',
        expiryText: 'This link expires in 1 hour.',
        securityText: 'If you didn\'t request this password reset, please ignore this email. Your password will remain unchanged.',
        teamSignature: 'ViralCut Pro Team'
      },
      'es': {
        subject: 'Restablecer contraseña - ViralCut Pro',
        greeting: `¡Hola ${user.firstName}!`,
        message: 'Solicitaste restablecer tu contraseña en ViralCut Pro. Haz clic en el botón de abajo para crear una nueva contraseña:',
        buttonText: 'Restablecer Contraseña',
        alternativeText: 'Si el botón no funciona, copia y pega este enlace en tu navegador:',
        expiryText: 'Este enlace expira en 1 hora.',
        securityText: 'Si no solicitaste este restablecimiento, ignora este email. Tu contraseña permanecerá sin cambios.',
        teamSignature: 'Equipo ViralCut Pro'
      }
    };

    const t = translations[user.language] || translations['pt-BR'];

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ViralCut Pro</div>
          </div>
          <div class="content">
            <h2>${t.greeting}</h2>
            <p>${t.message}</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">${t.buttonText}</a>
            </div>
            <p>${t.alternativeText}</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            <div class="warning">
              <p><strong>${t.expiryText}</strong></p>
            </div>
            <div class="footer">
              <p>${t.securityText}</p>
              <p>${t.teamSignature}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(user.email, t.subject, html);
  }

  async sendWelcomeEmail(user) {
    const translations = {
      'pt-BR': {
        subject: 'Bem-vindo ao ViralCut Pro!',
        greeting: `Olá ${user.firstName}!`,
        message: 'Bem-vindo ao ViralCut Pro! Estamos animados para ter você conosco.',
        features: [
          'Corte inteligente de vídeos com IA',
          'Otimização automática para redes sociais',
          'Edição rápida e intuitiva',
          'Suporte para múltiplas plataformas'
        ],
        getStarted: 'Para começar, faça login na sua conta e faça upload do seu primeiro vídeo!',
        buttonText: 'Começar Agora',
        teamSignature: 'Equipe ViralCut Pro'
      },
      'en': {
        subject: 'Welcome to ViralCut Pro!',
        greeting: `Hello ${user.firstName}!`,
        message: 'Welcome to ViralCut Pro! We\'re excited to have you on board.',
        features: [
          'AI-powered intelligent video cutting',
          'Automatic social media optimization',
          'Fast and intuitive editing',
          'Multi-platform support'
        ],
        getStarted: 'To get started, log in to your account and upload your first video!',
        buttonText: 'Get Started',
        teamSignature: 'ViralCut Pro Team'
      },
      'es': {
        subject: '¡Bienvenido a ViralCut Pro!',
        greeting: `¡Hola ${user.firstName}!`,
        message: '¡Bienvenido a ViralCut Pro! Estamos emocionados de tenerte con nosotros.',
        features: [
          'Corte inteligente de videos con IA',
          'Optimización automática para redes sociales',
          'Edición rápida e intuitiva',
          'Soporte para múltiples plataformas'
        ],
        getStarted: '¡Para comenzar, inicia sesión en tu cuenta y sube tu primer video!',
        buttonText: 'Comenzar Ahora',
        teamSignature: 'Equipo ViralCut Pro'
      }
    };

    const t = translations[user.language] || translations['pt-BR'];
    const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .features ul { list-style-type: none; padding: 0; }
          .features li { padding: 10px 0; border-bottom: 1px solid #eee; }
          .features li:before { content: "✓"; color: #27ae60; font-weight: bold; margin-right: 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ViralCut Pro</div>
          </div>
          <div class="content">
            <h2>${t.greeting}</h2>
            <p>${t.message}</p>
            <div class="features">
              <h3>Recursos disponíveis:</h3>
              <ul>
                ${t.features.map(feature => `<li>${feature}</li>`).join('')}
              </ul>
            </div>
            <p>${t.getStarted}</p>
            <div style="text-align: center;">
              <a href="${dashboardUrl}" class="button">${t.buttonText}</a>
            </div>
            <div class="footer">
              <p>${t.teamSignature}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(user.email, t.subject, html);
  }

  async sendVideoProcessingNotification(user, video, status) {
    const translations = {
      'pt-BR': {
        completed: {
          subject: 'Seu vídeo foi processado com sucesso!',
          message: `Seu vídeo "${video.title}" foi processado com sucesso e está pronto para download.`,
          buttonText: 'Ver Vídeo'
        },
        failed: {
          subject: 'Erro no processamento do vídeo',
          message: `Houve um erro ao processar seu vídeo "${video.title}". Nossa equipe foi notificada e está trabalhando para resolver o problema.`,
          buttonText: 'Tentar Novamente'
        }
      },
      'en': {
        completed: {
          subject: 'Your video has been processed successfully!',
          message: `Your video "${video.title}" has been processed successfully and is ready for download.`,
          buttonText: 'View Video'
        },
        failed: {
          subject: 'Video processing error',
          message: `There was an error processing your video "${video.title}". Our team has been notified and is working to resolve the issue.`,
          buttonText: 'Try Again'
        }
      },
      'es': {
        completed: {
          subject: '¡Tu video ha sido procesado exitosamente!',
          message: `Tu video "${video.title}" ha sido procesado exitosamente y está listo para descargar.`,
          buttonText: 'Ver Video'
        },
        failed: {
          subject: 'Error en el procesamiento del video',
          message: `Hubo un error al procesar tu video "${video.title}". Nuestro equipo ha sido notificado y está trabajando para resolver el problema.`,
          buttonText: 'Intentar de Nuevo'
        }
      }
    };

    const t = translations[user.language] || translations['pt-BR'];
    const statusText = t[status] || t.completed;
    const videoUrl = `${process.env.FRONTEND_URL}/videos/${video._id}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${statusText.subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: ${status === 'completed' ? '#27ae60' : '#e74c3c'}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ViralCut Pro</div>
          </div>
          <div class="content">
            <h2>Olá ${user.firstName}!</h2>
            <p>${statusText.message}</p>
            <div style="text-align: center;">
              <a href="${videoUrl}" class="button">${statusText.buttonText}</a>
            </div>
            <div class="footer">
              <p>Equipe ViralCut Pro</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(user.email, statusText.subject, html);
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }
}

module.exports = new EmailService();
