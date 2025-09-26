// Test script for email endpoints
import { sendEmail } from "./email.js";

// Test the help request email template
async function testHelpRequestEmail() {
  console.log("Testing Help Request Email...");
  
  const to = "test@example.com";
  const userName = "John Doe";
  const customerPhone = "+91-9876543210";
  
  const subject = "🚀 We're Here to Help You Post Your Property!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>We're Here to Help</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🚀 We're Here to Help You Post Your Property!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for choosing <strong>Home HNI</strong>! Our team will help you complete your property listing.</p>
            <p><strong>What happens next?</strong></p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>📞 Our agent will contact you within 12 hours</li>
              <li>📝 We'll help you fill all property details</li>
              <li>📸 Professional photography assistance available</li>
              <li>✅ Your property will go live within 24 hours</li>
            </ul>
            <p style="background:#f0f8ff;padding:15px;border-left:4px solid #d32f2f;margin:20px 0;">
              <strong>Contact Details:</strong><br>
              📱 WhatsApp: +91-9876543210<br>
              📧 Email: support@homehni.com<br>
              📞 Phone: ${customerPhone || 'Your registered number'}
            </p>
            <p>Our team is excited to help you showcase your property to thousands of potential buyers/tenants!</p>
            <p>Thanks,<br><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🚀 We're Here to Help You Post Your Property!

Hi ${userName || 'there'},

Thank you for choosing Home HNI! Our team will help you complete your property listing.

What happens next?
• 📞 Our agent will contact you within 12 hours
• 📝 We'll help you fill all property details
• 📸 Professional photography assistance available
• ✅ Your property will go live within 24 hours

Contact Details:
📱 WhatsApp: +91-9876543210
📧 Email: support@homehni.com
📞 Phone: ${customerPhone || 'Your registered number'}

Our team is excited to help you showcase your property to thousands of potential buyers/tenants!

Thanks,
Team Home HNI

© 2025 Home HNI`;

  try {
    const result = await sendEmail({ to, subject, html, text });
    console.log("✅ Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { status: "error", error: error.message };
  }
}

// Test the property submitted email template
async function testPropertySubmittedEmail() {
  console.log("Testing Property Submitted Email...");
  
  const to = "test@example.com";
  const userName = "Jane Smith";
  const propertyType = "2BHK Apartment";
  
  const subject = "✅ Thank You for Posting Your Property - Review in Progress!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Property Submitted Successfully</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">✅ Thank You for Posting Your Property!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for posting your <strong>${propertyType || 'property'}</strong> on Home HNI!</p>
            <p style="background:#e8f5e8;padding:15px;border-left:4px solid #4caf50;margin:20px 0;">
              <strong>What happens next?</strong><br>
              • Your property will be reviewed within 12 hours<br>
              • Once approved, it will go live immediately<br>
              • You'll receive a notification when it's live
            </p>
            <p><strong>Pricing Plans for ${propertyType || 'Your Property'}:</strong></p>
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:20px 0;border:1px solid #ddd;border-radius:5px;overflow:hidden;">
              <tr style="background:#f9f9f9;">
                <td style="padding:12px;border-bottom:1px solid #ddd;"><strong>Basic Plan</strong></td>
                <td style="padding:12px;border-bottom:1px solid #ddd;text-align:center;">FREE</td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #ddd;">• Basic listing visibility</td>
                <td style="padding:12px;border-bottom:1px solid #ddd;text-align:center;">• 30 days</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:12px;border-bottom:1px solid #ddd;"><strong>Premium Plan</strong></td>
                <td style="padding:12px;border-bottom:1px solid #ddd;text-align:center;">₹999/month</td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #ddd;">• Enhanced visibility</td>
                <td style="padding:12px;border-bottom:1px solid #ddd;text-align:center;">• Priority support</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:12px;"><strong>Elite Plan</strong></td>
                <td style="padding:12px;text-align:center;">₹1999/month</td>
              </tr>
              <tr>
                <td style="padding:12px;">• Featured listing</td>
                <td style="padding:12px;text-align:center;">• Dedicated advisor</td>
              </tr>
            </table>
            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/pricing" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 View All Pricing Plans</a>
            </p>
            <p>We'll notify you as soon as your property goes live!</p>
            <p>Thanks,<br><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `✅ Thank You for Posting Your Property!

Hi ${userName || 'there'},

Thank you for posting your ${propertyType || 'property'} on Home HNI!

What happens next?
• Your property will be reviewed within 12 hours
• Once approved, it will go live immediately
• You'll receive a notification when it's live

Pricing Plans for ${propertyType || 'Your Property'}:
Basic Plan - FREE
• Basic listing visibility
• 30 days

Premium Plan - ₹999/month
• Enhanced visibility
• Priority support

Elite Plan - ₹1999/month
• Featured listing
• Dedicated advisor

View all pricing plans: https://homehni.com/pricing

We'll notify you as soon as your property goes live!

Thanks,
Team Home HNI

© 2025 Home HNI`;

  try {
    const result = await sendEmail({ to, subject, html, text });
    console.log("✅ Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { status: "error", error: error.message };
  }
}

// Run tests
async function runTests() {
  console.log("🧪 Starting Email Template Tests...\n");
  
  // Test 1: Help Request Email
  await testHelpRequestEmail();
  console.log("\n" + "=".repeat(50) + "\n");
  
  // Test 2: Property Submitted Email
  await testPropertySubmittedEmail();
  console.log("\n" + "=".repeat(50) + "\n");
  
  console.log("🎉 All tests completed!");
}

// Run the tests
runTests().catch(console.error);
