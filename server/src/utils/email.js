import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  port: process.env.EMAIL_PORT || 2525,
  auth: {
    user: process.env.EMAIL_USER || 'your_mailtrap_user',
    pass: process.env.EMAIL_PASS || 'your_mailtrap_password'
  }
});

// Send verification email
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@bitbudget.com',
    to: email,
    subject: 'BitBudget - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8a2be2;">Welcome to BitBudget!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #8a2be2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can also click on the link below or copy it to your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>Best regards,<br>The BitBudget Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@bitbudget.com',
    to: email,
    subject: 'BitBudget - Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8a2be2;">Reset Your Password</h2>
        <p>You requested a password reset. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #8a2be2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can also click on the link below or copy it to your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The BitBudget Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};