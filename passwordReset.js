import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "./email.js";

// In-memory storage for reset tokens (in production, use a database)
const resetTokens = new Map();

// Token expiration time (15 minutes)
const TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Generate a secure random token for password reset
 * @returns {string} A secure random token
 */
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password to compare against
 * @returns {Promise<boolean>} True if passwords match
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Store reset token in memory with expiration
 * @param {string} email - User's email
 * @param {string} token - Reset token
 */
export const storeResetToken = (email, token) => {
  const expiryTime = Date.now() + TOKEN_EXPIRY;
  resetTokens.set(token, {
    email,
    createdAt: Date.now(),
    expiresAt: expiryTime,
    used: false
  });
  
  // Clean up expired tokens periodically
  cleanupExpiredTokens();
};

/**
 * Validate and consume a reset token
 * @param {string} token - Reset token to validate
 * @returns {object|null} Token data if valid, null if invalid/expired
 */
export const validateResetToken = (token) => {
  const tokenData = resetTokens.get(token);
  
  if (!tokenData) {
    return null;
  }
  
  if (tokenData.used) {
    return null;
  }
  
  if (Date.now() > tokenData.expiresAt) {
    resetTokens.delete(token);
    return null;
  }
  
  return tokenData;
};

/**
 * Mark a reset token as used
 * @param {string} token - Reset token to mark as used
 */
export const markTokenAsUsed = (token) => {
  const tokenData = resetTokens.get(token);
  if (tokenData) {
    tokenData.used = true;
    resetTokens.set(token, tokenData);
  }
};

/**
 * Clean up expired tokens from memory
 */
export const cleanupExpiredTokens = () => {
  const now = Date.now();
  for (const [token, data] of resetTokens.entries()) {
    if (now > data.expiresAt) {
      resetTokens.delete(token);
    }
  }
};

/**
 * Generate HTML email template for password reset
 * @param {string} userName - User's name
 * @param {string} resetLink - Password reset link
 * @returns {string} HTML email template
 */
export const generatePasswordResetEmailHTML = (userName, resetLink) => {
  const safeName = userName || 'User';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password - Home HNI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      background: #f7f7f8; 
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      color: #111827; 
      line-height: 1.6;
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: #ffffff; 
      border: 1px solid #e5e7eb; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: linear-gradient(135deg, #111827 0%, #374151 100%); 
      color: #fff; 
      padding: 30px 20px; 
      text-align: center;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .title { 
      margin: 0; 
      font-size: 20px; 
      font-weight: 600; 
    }
    .content { 
      padding: 40px 30px; 
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #111827;
    }
    .message {
      font-size: 16px;
      margin-bottom: 30px;
      color: #4b5563;
    }
    .reset-button { 
      display: inline-block; 
      background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%); 
      color: #fff !important; 
      text-decoration: none; 
      padding: 16px 32px; 
      border-radius: 8px; 
      font-weight: 600; 
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
      transition: all 0.3s ease;
    }
    .reset-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(211, 47, 47, 0.4);
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .alternative-link {
      margin-top: 20px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
      font-size: 14px;
      color: #6b7280;
    }
    .alternative-link a {
      color: #d32f2f;
      word-break: break-all;
    }
    .security-notice {
      margin-top: 30px;
      padding: 20px;
      background: #fef3f2;
      border-left: 4px solid #f87171;
      border-radius: 4px;
    }
    .security-notice h3 {
      margin: 0 0 10px 0;
      color: #dc2626;
      font-size: 16px;
    }
    .security-notice p {
      margin: 0;
      font-size: 14px;
      color: #7f1d1d;
    }
    .footer { 
      padding: 20px 30px; 
      font-size: 14px; 
      color: #6b7280; 
      border-top: 1px solid #f3f4f6; 
      background: #f9fafb;
      text-align: center;
    }
    .footer a { 
      color: #d32f2f; 
      text-decoration: none;
    }
    .expiry-notice {
      margin-top: 20px;
      font-size: 14px;
      color: #6b7280;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏠 Home HNI</div>
      <h1 class="title">Password Reset Request</h1>
    </div>
    <div class="content">
      <div class="greeting">Hello ${safeName},</div>
      
      <div class="message">
        We received a request to reset your password for your Home HNI account. 
        If you made this request, click the button below to reset your password.
      </div>
      
      <div class="button-container">
        <a href="${resetLink}" class="reset-button">Reset My Password</a>
      </div>
      
      <div class="alternative-link">
        <strong>Can't click the button?</strong><br>
        Copy and paste this link into your browser:<br>
        <a href="${resetLink}">${resetLink}</a>
      </div>
      
      <div class="expiry-notice">
        ⏰ This link will expire in 15 minutes for security reasons.
      </div>
      
      <div class="security-notice">
        <h3>🔒 Security Notice</h3>
        <p>
          If you didn't request this password reset, please ignore this email. 
          Your password will remain unchanged. For security, this link can only be used once.
        </p>
      </div>
    </div>
    <div class="footer">
      <p>
        This email was sent by <strong>Home HNI</strong><br>
        If you have any questions, please contact our support team.
      </p>
      <p>
        <a href="https://homehni.com">Visit Home HNI</a> | 
        <a href="https://homehni.com/support">Support</a>
      </p>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Generate plain text version of password reset email
 * @param {string} userName - User's name
 * @param {string} resetLink - Password reset link
 * @returns {string} Plain text email
 */
export const generatePasswordResetEmailText = (userName, resetLink) => {
  const safeName = userName || 'User';
  
  return `
Hello ${safeName},

We received a request to reset your password for your Home HNI account.

To reset your password, please click the following link:
${resetLink}

This link will expire in 15 minutes for security reasons.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

For security, this link can only be used once.

Best regards,
The Home HNI Team

---
Home HNI - Your Perfect Property Awaits
Visit us at: https://homehni.com
Support: https://homehni.com/support
`;
};

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} userName - User's name
 * @param {string} resetToken - Reset token
 * @returns {Promise<object>} Email sending result
 */
export const sendPasswordResetEmail = async (email, userName, resetToken) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL || 'https://homehni.com'}/reset-password?token=${resetToken}`;
    
    const subject = "Reset Your Password - Home HNI";
    const html = generatePasswordResetEmailHTML(userName, resetLink);
    const text = generatePasswordResetEmailText(userName, resetLink);
    
    const result = await sendEmail({
      to: email,
      subject,
      html,
      text
    });
    
    return result;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { status: "error", error: error.message };
  }
};

/**
 * Send password reset success confirmation email
 * @param {string} email - Recipient email
 * @param {string} userName - User's name
 * @returns {Promise<object>} Email sending result
 */
export const sendPasswordResetSuccessEmail = async (email, userName) => {
  try {
    const subject = "Password Successfully Reset - Home HNI";
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Password Reset Successful - Home HNI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      background: #f7f7f8; 
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      color: #111827; 
      line-height: 1.6;
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: #ffffff; 
      border: 1px solid #e5e7eb; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: linear-gradient(135deg, #059669 0%, #10b981 100%); 
      color: #fff; 
      padding: 30px 20px; 
      text-align: center;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .title { 
      margin: 0; 
      font-size: 20px; 
      font-weight: 600; 
    }
    .content { 
      padding: 40px 30px; 
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #111827;
    }
    .message {
      font-size: 16px;
      margin-bottom: 30px;
      color: #4b5563;
    }
    .success-icon {
      text-align: center;
      font-size: 48px;
      margin-bottom: 20px;
    }
    .footer { 
      padding: 20px 30px; 
      font-size: 14px; 
      color: #6b7280; 
      border-top: 1px solid #f3f4f6; 
      background: #f9fafb;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏠 Home HNI</div>
      <h1 class="title">Password Reset Successful</h1>
    </div>
    <div class="content">
      <div class="success-icon">✅</div>
      <div class="greeting">Hello ${userName || 'User'},</div>
      
      <div class="message">
        Your password has been successfully reset. You can now log in to your Home HNI account using your new password.
      </div>
      
      <div class="message">
        If you didn't make this change, please contact our support team immediately.
      </div>
    </div>
    <div class="footer">
      <p>
        This email was sent by <strong>Home HNI</strong><br>
        If you have any questions, please contact our support team.
      </p>
    </div>
  </div>
</body>
</html>`;
    
    const text = `
Hello ${userName || 'User'},

Your password has been successfully reset. You can now log in to your Home HNI account using your new password.

If you didn't make this change, please contact our support team immediately.

Best regards,
The Home HNI Team
`;
    
    const result = await sendEmail({
      to: email,
      subject,
      html,
      text
    });
    
    return result;
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    return { status: "error", error: error.message };
  }
};
