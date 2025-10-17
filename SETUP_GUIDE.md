# Password Reset Setup Guide

## Quick Setup Steps

### 1. Install Dependencies
```bash
npm install bcryptjs crypto
```

### 2. Environment Variables
Add these to your `.env` file:

```env
# Frontend URL for password reset links (REQUIRED)
FRONTEND_URL=https://homehni.com

# Your existing email and API configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
API_KEY=your-api-key
```

### 3. Database Integration
In `server.js`, replace the TODO comment in the reset-password endpoint:

```javascript
// Replace this line:
// TODO: Update password in your database here

// With your database update logic:
await updateUserPassword(tokenData.email, hashedPassword);
```

### 4. Test the Endpoints

**Forgot Password:**
```bash
curl -X POST http://localhost:3000/forgot-password \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"email": "test@example.com", "userName": "Test User"}'
```

**Reset Password:**
```bash
curl -X POST http://localhost:3000/reset-password \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"token": "reset-token-from-email", "newPassword": "newpass123", "confirmPassword": "newpass123"}'
```

### 5. Frontend Integration
Update your frontend to use the new endpoints instead of Supabase:

```javascript
// Replace Supabase calls with:
const response = await fetch('/forgot-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  },
  body: JSON.stringify({ email, userName })
});
```

## Security Notes

- **Simple Tokens**: Uses cryptographically secure random tokens (no JWT complexity)
- **Token Expiration**: Tokens expire in 15 minutes
- **One-time Use**: Each token can only be used once
- **Password Hashing**: Uses bcrypt with 12 salt rounds
- **Email Security**: Responses don't reveal if email exists

## Files Created/Modified

- ✅ `passwordReset.js` - Core password reset module
- ✅ `server.js` - Added three new endpoints
- ✅ `package.json` - Added required dependencies
- ✅ `PASSWORD_RESET_README.md` - Complete documentation

## Next Steps

1. Set up environment variables
2. Implement database integration
3. Test with your frontend
4. Deploy and monitor
