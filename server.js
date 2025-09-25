// server.js
import express from "express";
import dotenv from "dotenv";
import { sendEmail } from "./email.js";

dotenv.config();
const app = express();
app.use(express.json());

// Add CORS for your Lovable app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-api-key');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Simple API key check
app.use((req, res, next) => {
  const key = req.headers["x-api-key"];
  if (key !== process.env.API_KEY) return res.status(401).json({ status: "unauthorized" });
  next();
});

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) return res.status(400).json({ status: "error", error: "Missing fields" });

  const result = await sendEmail({ to, subject, text });
  res.json(result);
});

// Welcome email endpoint for new user signups
app.post("/send-welcome-email", async (req, res) => {
  const { to, userName } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "Welcome to Home HNI – Let's Find Your Perfect Property!";
  
  // Professional HTML email template
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Home HNI</title>
</head>
<body style="margin:0;padding:0;background-color:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background-color:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow:hidden;">
        <tr>
          <td align="center" style="background:#d32f2f;padding:20px;">
            <img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI" style="display:block;">
          </td>
        </tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">Welcome to Home HNI – Let's Find Your Perfect Property!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Welcome to <strong>Home HNI</strong>, India's premium real estate platform.</p>
            <p>Here's what you can do right away:</p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>🔍 Search from thousands of verified properties</li>
              <li>🏠 List your property for FREE</li>
              <li>🤝 Connect directly with buyers/tenants — zero brokerage</li>
            </ul>
            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Start Exploring on Home HNI</a>
            </p>
            <p>Thanks & Regards,<br><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr>
          <td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">
            <p style="margin:0;">&copy; 2025 Home HNI. All rights reserved.</p>
            <p style="margin:5px 0 0;">Visit <a href="https://homehni.com" style="color:#d32f2f;text-decoration:none;">homehni.com</a> • <a href="mailto:support@homehni.com" style="color:#d32f2f;text-decoration:none;">Contact Support</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // Fallback text version for email clients that don't support HTML
  const text = `Welcome to Home HNI – Let's Find Your Perfect Property!

Hi ${userName || 'there'},

Welcome to Home HNI, India's premium real estate platform.

Here's what you can do right away:
• 🔍 Search from thousands of verified properties
• 🏠 List your property for FREE
• 🤝 Connect directly with buyers/tenants — zero brokerage

Start exploring: https://homehni.com

Thanks & Regards,
Team Home HNI

© 2025 Home HNI. All rights reserved.
Visit homehni.com • Contact Support`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 2. Property listing live email
app.post("/send-listing-live-email", async (req, res) => {
  const { to, userName, price, bhkDetails, locality, phone, propertyUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🎉 Your Property is Now Live on Home HNI!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Your Listing is Live</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🎉 Your Property is Now Live on Home HNI!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Good news! Your property is live on <strong>Home HNI</strong>.</p>
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:10px 0 20px;">
              <tr><td style="padding:6px 0;"><strong>Rent/Sale Price:</strong> ₹${price || 'N/A'}</td></tr>
              <tr><td style="padding:6px 0;"><strong>Type:</strong> ${bhkDetails || 'N/A'}</td></tr>
              <tr><td style="padding:6px 0;"><strong>Locality:</strong> ${locality || 'N/A'}</td></tr>
            </table>
            <p>📞 Interested users will contact you at <strong>${phone || 'N/A'}</strong>. You'll also see their details on your dashboard.</p>
            <p style="text-align:center;margin:28px 0;">
              <a href="${propertyUrl || 'https://homehni.com'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 View My Property</a>
            </p>
            <p>Boost visibility with <strong>Promoted Listings</strong> for faster closure.</p>
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

  const text = `🎉 Your Property is Now Live on Home HNI!

Hi ${userName || 'there'},

Good news! Your property is live on Home HNI.

Property Details:
• Rent/Sale Price: ₹${price || 'N/A'}
• Type: ${bhkDetails || 'N/A'}
• Locality: ${locality || 'N/A'}

📞 Interested users will contact you at ${phone || 'N/A'}. You'll also see their details on your dashboard.

View your property: ${propertyUrl || 'https://homehni.com'}

Boost visibility with Promoted Listings for faster closure.

Thanks,
Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 3. Price suggestions email
app.post("/send-price-suggestions-email", async (req, res) => {
  const { to, userName, locality, rangeMin, rangeMax, yourPrice, updatePriceUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "Rent & Sale Trends in " + (locality || 'Your Area');
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Price Suggestions & Trends</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">Rent & Sale Trends in ${locality || 'Your Area'}</h2>
            <p>Hello ${userName || 'there'},</p>
            <p>In the past 30 days, properties in <strong>${locality || 'your area'}</strong> closed at <strong>₹${rangeMin || 'N/A'} – ₹${rangeMax || 'N/A'}</strong>. Your property is listed at <strong>₹${yourPrice || 'N/A'}</strong>.</p>
            <p style="text-align:center;margin:28px 0;">
              <a href="${updatePriceUrl || 'https://homehni.com/dashboard'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Update My Price</a>
            </p>
            <p>Well-priced properties rent/sell <strong>2X faster</strong>.</p>
            <p><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Rent & Sale Trends in ${locality || 'Your Area'}

Hello ${userName || 'there'},

In the past 30 days, properties in ${locality || 'your area'} closed at ₹${rangeMin || 'N/A'} – ₹${rangeMax || 'N/A'}. Your property is listed at ₹${yourPrice || 'N/A'}.

Update your price: ${updatePriceUrl || 'https://homehni.com/dashboard'}

Well-priced properties rent/sell 2X faster.

Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 4. Loan enquiry email
app.post("/send-loan-enquiry-email", async (req, res) => {
  const { to, userName, loanEligibilityUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "Need a Home Loan? Instant Approval via Home HNI Partners";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Home Loan via Home HNI Partners</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">Need a Home Loan? Instant Approval via Home HNI Partners</h2>
            <p>Hello ${userName || 'there'},</p>
            <p>Looking to sell or buy? Get financial assistance with:</p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>Instant loan approval</li>
              <li>Best interest rates</li>
              <li>Hassle-free documentation</li>
            </ul>
            <p style="text-align:center;margin:28px 0;">
              <a href="${loanEligibilityUrl || 'https://homehni.com/loan-eligibility'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 30px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Check My Eligibility</a>
            </p>
            <p>Finance made simple with Home HNI.</p>
            <p><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Need a Home Loan? Instant Approval via Home HNI Partners

Hello ${userName || 'there'},

Looking to sell or buy? Get financial assistance with:
• Instant loan approval
• Best interest rates
• Hassle-free documentation

Check your eligibility: ${loanEligibilityUrl || 'https://homehni.com/loan-eligibility'}

Finance made simple with Home HNI.

Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 5. Premium plan activated email
app.post("/send-plan-activated-email", async (req, res) => {
  const { to, userName, startUsingPlanUrl, planExpiryDate } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🎉 Your Home HNI Premium Plan is Activated!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Premium Plan Activated</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🎉 Your Home HNI Premium Plan is Activated!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for upgrading to <strong>Home HNI Premium</strong>. Your benefits include:</p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>Unlimited verified contacts</li>
              <li>Promoted listing visibility</li>
              <li>Privacy protection</li>
            </ul>
            <p style="text-align:center;margin:28px 0;">
              <a href="${startUsingPlanUrl || 'https://homehni.com/dashboard'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 30px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Start Using My Plan</a>
            </p>
            <p>Valid till <strong>${planExpiryDate || 'N/A'}</strong>.</p>
            <p><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🎉 Your Home HNI Premium Plan is Activated!

Hi ${userName || 'there'},

Thank you for upgrading to Home HNI Premium. Your benefits include:
• Unlimited verified contacts
• Promoted listing visibility
• Privacy protection

Start using your plan: ${startUsingPlanUrl || 'https://homehni.com/dashboard'}

Valid till ${planExpiryDate || 'N/A'}.

Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 6. Plan upgrade suggestion email
app.post("/send-plan-upgrade-email", async (req, res) => {
  const { to, userName, upgradePlanUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "Unlock More With Home HNI Elite Plan";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Upgrade to Elite Plan</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">Unlock More With Home HNI Elite Plan</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Upgrade to <strong>Elite</strong> and enjoy:</p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>Featured listings in top searches</li>
              <li>Dedicated property advisor</li>
              <li>Free agreement &amp; legal support</li>
            </ul>
            <p style="text-align:center;margin:28px 0;">
              <a href="${upgradePlanUrl || 'https://homehni.com/upgrade'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 30px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Upgrade Now</a>
            </p>
            <p>Elite = faster deals + more savings.</p>
            <p><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Unlock More With Home HNI Elite Plan

Hi ${userName || 'there'},

Upgrade to Elite and enjoy:
• Featured listings in top searches
• Dedicated property advisor
• Free agreement & legal support

Upgrade now: ${upgradePlanUrl || 'https://homehni.com/upgrade'}

Elite = faster deals + more savings.

Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 7. Deal closed email
app.post("/send-deal-closed-email", async (req, res) => {
  const { to, userName, locality, dealType, postDealServicesUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🎉 Congratulations! Your Deal is Closed With Home HNI";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Congratulations! Deal Closed</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🎉 Congratulations! Your Deal is Closed With Home HNI</h2>
            <p>Dear ${userName || 'there'},</p>
            <p>Your property in <strong>${locality || 'your area'}</strong> is now successfully <strong>${dealType || 'sold/rented'}</strong> with Home HNI.</p>
            <p>Need help with:</p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>🚚 Packing &amp; Moving</li>
              <li>🎨 Cleaning &amp; Painting</li>
              <li>📜 Legal Agreements</li>
            </ul>
            <p style="text-align:center;margin:28px 0;">
              <a href="${postDealServicesUrl || 'https://homehni.com/services'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 30px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Explore Services</a>
            </p>
            <p>Best wishes,<br><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🎉 Congratulations! Your Deal is Closed With Home HNI

Dear ${userName || 'there'},

Your property in ${locality || 'your area'} is now successfully ${dealType || 'sold/rented'} with Home HNI.

Need help with:
• 🚚 Packing & Moving
• 🎨 Cleaning & Painting
• 📜 Legal Agreements

Explore services: ${postDealServicesUrl || 'https://homehni.com/services'}

Best wishes,
Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export for Vercel
export default app;
