# Password Reset Module Documentation

This document describes the new password reset functionality that replaces the Supabase implementation with a custom solution using your existing email infrastructure (nodemailer + Gmail).

## Overview

The password reset system consists of:
- **passwordReset.js**: Core module with token generation, validation, and email functionality
- **Server endpoints**: Three new API endpoints for password reset flow
- **Security features**: Simple secure tokens, bcrypt hashing, token expiration, and one-time use

## Installation

Install the required dependencies:

```bash
npm install bcryptjs crypto
```

## Environment Variables

Add these environment variables to your `.env` file:

```env
# Frontend URL for password reset links (REQUIRED)
FRONTEND_URL=https://homehni.com

# Your existing email configuration (already configured)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# API Key for authentication (already configured)
API_KEY=your-api-key
```

## API Endpoints

### 1. Forgot Password - Send Reset Email

**Endpoint:** `POST /forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com",
  "userName": "John Doe" // optional
}
```

**Response:**
```json
{
  "status": "success",
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**Features:**
- Email format validation
- Secure token generation
- Professional HTML email template
- Security-first response (doesn't reveal if email exists)

### 2. Reset Password - Update Password

**Endpoint:** `POST /reset-password`

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123",
  "userName": "John Doe" // optional, for confirmation email
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password has been successfully reset. You can now log in with your new password."
}
```

**Features:**
- Token validation and expiration check
- Password strength validation (minimum 8 characters)
- Password confirmation matching
- One-time token usage
- Automatic password hashing with bcrypt
- Success confirmation email

### 3. Validate Reset Token - Check Token Validity

**Endpoint:** `POST /validate-reset-token`

**Request Body:**
```json
{
  "token": "reset-token-from-email"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Token is valid",
  "email": "user@example.com"
}
```

**Features:**
- Token validation without consuming it
- Useful for frontend validation before showing reset form

## Security Features

### Token Security
- **Secure Tokens**: 32-byte cryptographically secure random tokens
- **Expiration**: 15-minute token lifetime
- **One-time Use**: Tokens are marked as used after password reset
- **Memory Storage**: Tokens stored in memory with automatic cleanup

### Password Security
- **bcrypt Hashing**: Passwords hashed with 12 salt rounds
- **Strength Validation**: Minimum 8 character requirement
- **Confirmation**: Password confirmation matching

### Email Security
- **Professional Templates**: Branded HTML and text email templates
- **Security Notices**: Clear instructions about token expiration and usage
- **No Information Leakage**: Responses don't reveal if email exists

## Frontend Integration

### 1. Forgot Password Flow

```javascript
// Send forgot password request
const forgotPassword = async (email, userName) => {
  const response = await fetch('/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'your-api-key'
    },
    body: JSON.stringify({ email, userName })
  });
  
  const result = await response.json();
  return result;
};
```

### 2. Password Reset Flow

```javascript
// Validate token first
const validateToken = async (token) => {
  const response = await fetch('/validate-reset-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'your-api-key'
    },
    body: JSON.stringify({ token })
  });
  
  return await response.json();
};

// Reset password
const resetPassword = async (token, newPassword, confirmPassword) => {
  const response = await fetch('/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'your-api-key'
    },
    body: JSON.stringify({ token, newPassword, confirmPassword })
  });
  
  return await response.json();
};
```

### 3. URL Structure

The reset link in emails follows this pattern:
```
https://yourdomain.com/reset-password?token=jwt-token-here
```

Extract the token from the URL parameter:
```javascript
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
```

## Database Integration

**Important:** You need to implement database integration for the actual password update. In the `reset-password` endpoint, replace this TODO:

```javascript
// TODO: Update password in your database here
// Example: await updateUserPassword(tokenData.email, hashedPassword);
```

With your actual database update logic:

```javascript
// Example implementation
const updateUserPassword = async (email, hashedPassword) => {
  // Update user password in your database
  // This depends on your database setup (MongoDB, PostgreSQL, etc.)
  await db.collection('users').updateOne(
    { email: email },
    { $set: { password: hashedPassword, updatedAt: new Date() } }
  );
};
```

## Email Templates

The system includes professional HTML and text email templates:

### Password Reset Email
- Branded Home HNI design
- Clear call-to-action button
- Security notices
- Alternative text link
- Expiration warning

### Password Reset Success Email
- Confirmation of successful reset
- Security notice if unauthorized
- Professional branding

## Error Handling

All endpoints include comprehensive error handling:

- **400 Bad Request**: Invalid input, expired tokens, password mismatches
- **500 Internal Server Error**: Server-side errors, email sending failures

Common error responses:
```json
{
  "status": "error",
  "error": "Error description"
}
```

## Testing

Test the endpoints using curl or Postman:

```bash
# Test forgot password
curl -X POST http://localhost:3000/forgot-password \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"email": "test@example.com", "userName": "Test User"}'

# Test token validation
curl -X POST http://localhost:3000/validate-reset-token \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"token": "your-jwt-token"}'

# Test password reset
curl -X POST http://localhost:3000/reset-password \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"token": "your-jwt-token", "newPassword": "newpass123", "confirmPassword": "newpass123"}'
```

## Migration from Supabase

This implementation replaces Supabase's password reset functionality:

1. **Remove Supabase auth calls** from your frontend
2. **Update API endpoints** to use the new `/forgot-password` and `/reset-password` endpoints
3. **Update email templates** to use the new branded templates
4. **Implement database integration** for password updates
5. **Test thoroughly** with various scenarios

## Maintenance

- **Token Cleanup**: Expired tokens are automatically cleaned up
- **Security Updates**: Regularly update dependencies
- **Monitoring**: Monitor email delivery rates and error logs
- **Backup**: Ensure proper backup of user data and password hashes

## Support

For issues or questions about the password reset implementation, check:
1. Server logs for detailed error messages
2. Email delivery status
3. Token expiration times
4. Database connection and update operations
