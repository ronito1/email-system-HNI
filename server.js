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

  const subject = "✅ Thank you for applying for a Home Loan – We'll contact you within 12 hours";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Home Loan Application Received</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">✅ Thank you for applying for a Home Loan</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>We’ve received your loan request. <strong>Our agents will contact you within 12 hours</strong> to assist with next steps.</p>
            <p><strong>What we'll help you with:</strong></p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>Eligibility and best-rate options</li>
              <li>Required documentation checklist</li>
              <li>Fast-track approval via Home HNI partners</li>
            </ul>
            <p style="text-align:center;margin:28px 0;">
              <a href="${loanEligibilityUrl || 'https://homehni.com/loan-eligibility'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 30px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Check Eligibility / Prepare Docs</a>
            </p>
            <p>Thanks for choosing <strong>Home HNI</strong>.</p>
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

  const text = `✅ Thank you for applying for a Home Loan

Hi ${userName || 'there'},

We’ve received your loan request. Our agents will contact you within 12 hours to assist with next steps.

What we'll help you with:
• Eligibility and best-rate options
• Required documentation checklist
• Fast-track approval via Home HNI partners

Prepare now: ${loanEligibilityUrl || 'https://homehni.com/loan-eligibility'}

Thanks for choosing Home HNI.

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

// 8. Help request email (Don't want to fill all details? Let us help you)
app.post("/send-help-request-email", async (req, res) => {
  const { to, userName, customerPhone, adminEmail } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

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

  const result = await sendEmail({ to, subject, html, text });
  
  // Also send to admin if adminEmail is provided
  if (adminEmail) {
    const adminSubject = "New Help Request - Property Listing Assistance";
    const adminHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>New Help Request</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">New Help Request - Property Listing Assistance</h2>
            <p>A customer has requested help with their property listing:</p>
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:20px 0;background:#f9f9f9;padding:15px;border-radius:5px;">
              <tr><td style="padding:6px 0;"><strong>Customer Name:</strong> ${userName || 'N/A'}</td></tr>
              <tr><td style="padding:6px 0;"><strong>Email:</strong> ${to}</td></tr>
              <tr><td style="padding:6px 0;"><strong>Phone:</strong> ${customerPhone || 'N/A'}</td></tr>
              <tr><td style="padding:6px 0;"><strong>Request Time:</strong> ${new Date().toLocaleString()}</td></tr>
            </table>
            <p style="background:#fff3cd;padding:15px;border-left:4px solid #ffc107;margin:20px 0;">
              <strong>Action Required:</strong> Contact the customer within 12 hours to assist with property listing.
            </p>
            <p>Please follow up promptly to ensure customer satisfaction.</p>
            <p>Thanks,<br><strong>Home HNI System</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const adminText = `New Help Request - Property Listing Assistance

A customer has requested help with their property listing:

Customer Name: ${userName || 'N/A'}
Email: ${to}
Phone: ${customerPhone || 'N/A'}
Request Time: ${new Date().toLocaleString()}

Action Required: Contact the customer within 12 hours to assist with property listing.

Please follow up promptly to ensure customer satisfaction.

Thanks,
Home HNI System

© 2025 Home HNI`;

    await sendEmail({ to: adminEmail, subject: adminSubject, html: adminHtml, text: adminText });
  }
  
  res.json(result);
});

// 9. Freshly painted homes email
app.post("/send-freshly-painted-email", async (req, res) => {
  const { to, userName } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🎨 Freshly Painted Homes - Our Agent Will Contact You Soon!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Freshly Painted Homes</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🎨 Freshly Painted Homes - Our Agent Will Contact You Soon!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for selecting the <strong>"Freshly Painted Homes"</strong> option!</p>
            <p>Our specialized agent will contact you within <strong>12 hours</strong> to discuss:</p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>🎨 Fresh painting services for your property</li>
              <li>💰 Competitive pricing and packages</li>
              <li>📅 Scheduling and timeline</li>
              <li>✅ Quality assurance and warranty</li>
            </ul>
            <p style="background:#e8f5e8;padding:15px;border-left:4px solid #4caf50;margin:20px 0;">
              <strong>What to expect:</strong><br>
              • Professional consultation call<br>
              • Customized painting plan<br>
              • Transparent pricing<br>
              • Quality materials and workmanship
            </p>
            <p>We're excited to help make your property look fresh and appealing to potential buyers/tenants!</p>
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

  const text = `🎨 Freshly Painted Homes - Our Agent Will Contact You Soon!

Hi ${userName || 'there'},

Thank you for selecting the "Freshly Painted Homes" option!

Our specialized agent will contact you within 12 hours to discuss:
• 🎨 Fresh painting services for your property
• 💰 Competitive pricing and packages
• 📅 Scheduling and timeline
• ✅ Quality assurance and warranty

What to expect:
• Professional consultation call
• Customized painting plan
• Transparent pricing
• Quality materials and workmanship

We're excited to help make your property look fresh and appealing to potential buyers/tenants!

Thanks,
Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 10. Property submitted email (Submit property trigger)
app.post("/send-property-submitted-email", async (req, res) => {
  const { to, userName, propertyType, pricingPlanUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

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
              <a href="${pricingPlanUrl || 'https://homehni.com/pricing'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 View All Pricing Plans</a>
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

View all pricing plans: ${pricingPlanUrl || 'https://homehni.com/pricing'}

We'll notify you as soon as your property goes live!

Thanks,
Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 11. Property rejected email (Admin reject button)
app.post("/send-property-rejected-email", async (req, res) => {
  const { to, userName, rejectionReasons, propertyType } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "❌ Property Listing Update - Action Required";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Property Listing Rejected</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">❌ Property Listing Update - Action Required</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>We're sorry, but we cannot post your <strong>${propertyType || 'property'}</strong> listing at this time.</p>
            <p style="background:#ffebee;padding:15px;border-left:4px solid #f44336;margin:20px 0;">
              <strong>Reasons for rejection:</strong><br>
              ${rejectionReasons || '• Images quality/appropriateness<br>• Property name/description issues<br>• Inappropriate content<br>• Missing required information'}
            </p>
            <p><strong>What you can do:</strong></p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>📸 Upload high-quality, appropriate images</li>
              <li>📝 Review and update property description</li>
              <li>✅ Ensure all required fields are completed</li>
              <li>🔄 Resubmit your listing</li>
            </ul>
            <p style="background:#e3f2fd;padding:15px;border-left:4px solid #2196f3;margin:20px 0;">
              <strong>Need help?</strong><br>
              Our support team is here to assist you. Contact us at support@homehni.com or call +91-9876543210
            </p>
            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/dashboard" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Update My Listing</a>
            </p>
            <p>We're committed to helping you successfully list your property!</p>
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

  const text = `❌ Property Listing Update - Action Required

Hi ${userName || 'there'},

We're sorry, but we cannot post your ${propertyType || 'property'} listing at this time.

Reasons for rejection:
${rejectionReasons || '• Images quality/appropriateness\n• Property name/description issues\n• Inappropriate content\n• Missing required information'}

What you can do:
• 📸 Upload high-quality, appropriate images
• 📝 Review and update property description
• ✅ Ensure all required fields are completed
• 🔄 Resubmit your listing

Need help?
Our support team is here to assist you. Contact us at support@homehni.com or call +91-9876543210

Update your listing: https://homehni.com/dashboard

We're committed to helping you successfully list your property!

Thanks,
Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 12. Show interest email (Show interest button trigger)
app.post("/send-show-interest-email", async (req, res) => {
  const { to, userName, propertyType, pricingPlanUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "💝 Thank You for Showing Interest - Exclusive Pricing Plans!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Show Interest - Pricing Plans</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">💝 Thank You for Showing Interest!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for showing interest in our <strong>${propertyType || 'property'}</strong> listings!</p>
            <p style="background:#fff3e0;padding:15px;border-left:4px solid #ff9800;margin:20px 0;">
              <strong>Special Offer for You:</strong><br>
              Get exclusive access to premium features and connect directly with property owners!
            </p>
            <p><strong>Pricing Plans for ${propertyType || 'Property'} Interest:</strong></p>
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:20px 0;border:1px solid #ddd;border-radius:5px;overflow:hidden;">
              <tr style="background:#f9f9f9;">
                <td style="padding:12px;border-bottom:1px solid #ddd;"><strong>Basic Interest</strong></td>
                <td style="padding:12px;border-bottom:1px solid #ddd;text-align:center;">FREE</td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #ddd;">• View property details</td>
                <td style="padding:12px;border-bottom:1px solid #ddd;text-align:center;">• Basic contact info</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:12px;border-bottom:1px solid #ddd;"><strong>Premium Interest</strong></td>
                <td style="padding:12px;border-bottom:1px solid #ddd;text-align:center;">₹499/month</td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #ddd;">• Direct owner contact</td>
                <td style="padding:12px;border-bottom:1px solid #ddd;text-align:center;">• Priority notifications</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:12px;"><strong>Elite Interest</strong></td>
                <td style="padding:12px;text-align:center;">₹999/month</td>
              </tr>
              <tr>
                <td style="padding:12px;">• Unlimited contacts</td>
                <td style="padding:12px;text-align:center;">• Personal advisor</td>
              </tr>
            </table>
            <p style="text-align:center;margin:28px 0;">
              <a href="${pricingPlanUrl || 'https://homehni.com/pricing'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Choose Your Plan</a>
            </p>
            <p>Unlock the power of direct connections and find your perfect property faster!</p>
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

  const text = `💝 Thank You for Showing Interest!

Hi ${userName || 'there'},

Thank you for showing interest in our ${propertyType || 'property'} listings!

Special Offer for You:
Get exclusive access to premium features and connect directly with property owners!

Pricing Plans for ${propertyType || 'Property'} Interest:
Basic Interest - FREE
• View property details
• Basic contact info

Premium Interest - ₹499/month
• Direct owner contact
• Priority notifications

Elite Interest - ₹999/month
• Unlimited contacts
• Personal advisor

Choose your plan: ${pricingPlanUrl || 'https://homehni.com/pricing'}

Unlock the power of direct connections and find your perfect property faster!

Thanks,
Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 13. Mark as rented/sold email
app.post("/send-mark-rented-sold-email", async (req, res) => {
  const { to, userName, propertyType, status } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "✅ Property Status Updated Successfully!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Property Status Updated</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">✅ Property Status Updated Successfully!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you! We've successfully updated your property status.</p>
            <p style="background:#e8f5e8;padding:15px;border-left:4px solid #4caf50;margin:20px 0;">
              <strong>Status Update:</strong><br>
              Your <strong>${propertyType || 'property'}</strong> has been marked as <strong>${status || 'rented/sold'}</strong>
            </p>
            <p><strong>What happens next?</strong></p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>✅ Your property listing will be updated</li>
              <li>📧 Interested parties will be notified</li>
              <li>📊 Your dashboard will reflect the new status</li>
              <li>🎉 Congratulations on your successful deal!</li>
            </ul>
            <p style="background:#e3f2fd;padding:15px;border-left:4px solid #2196f3;margin:20px 0;">
              <strong>Need help with your next property?</strong><br>
              List your next property for FREE and reach thousands of potential buyers/tenants!
            </p>
            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/dashboard" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 View My Dashboard</a>
            </p>
            <p>Thank you for choosing Home HNI for your property needs!</p>
            <p>Best regards,<br><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `✅ Property Status Updated Successfully!

Hi ${userName || 'there'},

Thank you! We've successfully updated your property status.

Status Update:
Your ${propertyType || 'property'} has been marked as ${status || 'rented/sold'}

What happens next?
• ✅ Your property listing will be updated
• 📧 Interested parties will be notified
• 📊 Your dashboard will reflect the new status
• 🎉 Congratulations on your successful deal!

Need help with your next property?
List your next property for FREE and reach thousands of potential buyers/tenants!

View your dashboard: https://homehni.com/dashboard

Thank you for choosing Home HNI for your property needs!

Best regards,
Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 14. Contact owner email (Contact owner button trigger)
app.post("/send-contact-owner-email", async (req, res) => {
  const { to, userName, propertyAddress, dashboardUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🔍 Someone Asked for Your Property Details!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Property Inquiry Received</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🔍 Someone Asked for Your Property Details!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Great news! Someone is interested in your property and has requested more details.</p>
            <p style="background:#e8f5e8;padding:15px;border-left:4px solid #4caf50;margin:20px 0;">
              <strong>Property Details:</strong><br>
              📍 Address: ${propertyAddress || 'Your listed property'}<br>
              ⏰ Inquiry Time: ${new Date().toLocaleString()}
            </p>
            <p><strong>What you can do:</strong></p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>👀 View the interested party's details</li>
              <li>📞 Contact them directly</li>
              <li>📋 Manage your property inquiries</li>
              <li>📊 Track your property performance</li>
            </ul>
            <p style="text-align:center;margin:28px 0;">
              <a href="${dashboardUrl || 'https://homehni.com/dashboard/owners-contacted'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Click to Know Who He Is</a>
            </p>
            <p style="background:#fff3e0;padding:15px;border-left:4px solid #ff9800;margin:20px 0;">
              <strong>Pro Tip:</strong> Respond quickly to inquiries to increase your chances of closing the deal!
            </p>
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

  const text = `🔍 Someone Asked for Your Property Details!

Hi ${userName || 'there'},

Great news! Someone is interested in your property and has requested more details.

Property Details:
📍 Address: ${propertyAddress || 'Your listed property'}
⏰ Inquiry Time: ${new Date().toLocaleString()}

What you can do:
• 👀 View the interested party's details
• 📞 Contact them directly
• 📋 Manage your property inquiries
• 📊 Track your property performance

Click to know who he is: ${dashboardUrl || 'https://homehni.com/dashboard/owners-contacted'}

Pro Tip: Respond quickly to inquiries to increase your chances of closing the deal!

Thanks,
Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 15. Visit scheduled email (Show Interest form submission)
app.post("/send-visit-scheduled-email", async (req, res) => {
  const { to, userName, propertyAddress, visitorName, visitorPhone, visitDate, visitTime } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🏠 Property Visit Scheduled - New Inquiry!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Property Visit Scheduled</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🏠 Property Visit Scheduled - New Inquiry!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Exciting news! Someone wants to visit your property and has scheduled a viewing.</p>
            <p style="background:#e8f5e8;padding:15px;border-left:4px solid #4caf50;margin:20px 0;">
              <strong>Visit Details:</strong><br>
              📍 Property: ${propertyAddress || 'Your listed property'}<br>
              👤 Visitor: ${visitorName || 'Interested party'}<br>
              📞 Contact: ${visitorPhone || 'Available in dashboard'}<br>
              📅 Date: ${visitDate || 'To be confirmed'}<br>
              ⏰ Time: ${visitTime || 'To be confirmed'}
            </p>
            <p><strong>What you should do:</strong></p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>📞 Contact the visitor to confirm details</li>
              <li>🏠 Prepare your property for viewing</li>
              <li>📋 Have all necessary documents ready</li>
              <li>✅ Be available during the scheduled time</li>
            </ul>
            <p style="background:#e3f2fd;padding:15px;border-left:4px solid #2196f3;margin:20px 0;">
              <strong>Preparation Tips:</strong><br>
              • Clean and declutter your property<br>
              • Ensure good lighting and ventilation<br>
              • Have property documents ready<br>
              • Be prepared to answer questions
            </p>
            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/dashboard" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Manage My Inquiries</a>
            </p>
            <p>Good luck with your property viewing!</p>
            <p>Best regards,<br><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🏠 Property Visit Scheduled - New Inquiry!

Hi ${userName || 'there'},

Exciting news! Someone wants to visit your property and has scheduled a viewing.

Visit Details:
📍 Property: ${propertyAddress || 'Your listed property'}
👤 Visitor: ${visitorName || 'Interested party'}
📞 Contact: ${visitorPhone || 'Available in dashboard'}
📅 Date: ${visitDate || 'To be confirmed'}
⏰ Time: ${visitTime || 'To be confirmed'}

What you should do:
• 📞 Contact the visitor to confirm details
• 🏠 Prepare your property for viewing
• 📋 Have all necessary documents ready
• ✅ Be available during the scheduled time

Preparation Tips:
• Clean and declutter your property
• Ensure good lighting and ventilation
• Have property documents ready
• Be prepared to answer questions

Manage your inquiries: https://homehni.com/dashboard

Good luck with your property viewing!

Best regards,
Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 16. Payment success email
app.post("/send-payment-success-email", async (req, res) => {
  const { to, userName, planName, amount, transactionId } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "✅ Payment Successful - Welcome to Home HNI Premium!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Payment Successful</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">✅ Payment Successful!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Congratulations! Your payment has been processed successfully.</p>
            <p style="background:#e8f5e8;padding:15px;border-left:4px solid #4caf50;margin:20px 0;">
              <strong>Payment Details:</strong><br>
              💳 Plan: ${planName || 'Premium Plan'}<br>
              💰 Amount: ₹${amount || 'N/A'}<br>
              🆔 Transaction ID: ${transactionId || 'N/A'}<br>
              📅 Date: ${new Date().toLocaleString()}
            </p>
            <p><strong>What's next?</strong></p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>🎉 Your premium features are now active</li>
              <li>📧 You'll receive your invoice shortly</li>
              <li>🚀 Start enjoying enhanced visibility</li>
              <li>📞 Priority support is now available</li>
            </ul>
            <p style="background:#e3f2fd;padding:15px;border-left:4px solid #2196f3;margin:20px 0;">
              <strong>Need help getting started?</strong><br>
              Our support team is here to help you make the most of your premium features!
            </p>
            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/dashboard" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Access My Dashboard</a>
            </p>
            <p>Thank you for choosing Home HNI Premium!</p>
            <p>Best regards,<br><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `✅ Payment Successful!

Hi ${userName || 'there'},

Congratulations! Your payment has been processed successfully.

Payment Details:
💳 Plan: ${planName || 'Premium Plan'}
💰 Amount: ₹${amount || 'N/A'}
🆔 Transaction ID: ${transactionId || 'N/A'}
📅 Date: ${new Date().toLocaleString()}

What's next?
• 🎉 Your premium features are now active
• 📧 You'll receive your invoice shortly
• 🚀 Start enjoying enhanced visibility
• 📞 Priority support is now available

Need help getting started?
Our support team is here to help you make the most of your premium features!

Access your dashboard: https://homehni.com/dashboard

Thank you for choosing Home HNI Premium!

Best regards,
Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 17. Payment invoice email
app.post("/send-payment-invoice-email", async (req, res) => {
  const { to, userName, planName, amount, transactionId, planDetails, invoiceUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "📄 Your Home HNI Invoice - Payment Confirmation";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Payment Invoice</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">📄 Your Home HNI Invoice</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for your payment! Here's your invoice for the selected plan.</p>
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:20px 0;border:1px solid #ddd;border-radius:5px;overflow:hidden;">
              <tr style="background:#f9f9f9;">
                <td style="padding:12px;border-bottom:1px solid #ddd;"><strong>Invoice Details</strong></td>
                <td style="padding:12px;border-bottom:1px solid #ddd;text-align:right;"><strong>Amount</strong></td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #ddd;">${planName || 'Premium Plan'}</td>
                <td style="padding:12px;border-bottom:1px solid #ddd;text-align:right;">₹${amount || 'N/A'}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:12px;border-bottom:1px solid #ddd;">Transaction ID</td>
                <td style="padding:12px;border-bottom:1px solid #ddd;text-align:right;">${transactionId || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #ddd;">Payment Date</td>
                <td style="padding:12px;border-bottom:1px solid #ddd;text-align:right;">${new Date().toLocaleDateString()}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:12px;"><strong>Total Amount</strong></td>
                <td style="padding:12px;text-align:right;"><strong>₹${amount || 'N/A'}</strong></td>
              </tr>
            </table>
            <p><strong>Plan Features:</strong></p>
            <ul style="padding-left:20px;margin:12px 0;">
              ${planDetails || '<li>Enhanced property visibility</li><li>Priority customer support</li><li>Advanced analytics</li><li>Direct owner contact</li>'}
            </ul>
            <p style="text-align:center;margin:28px 0;">
              <a href="${invoiceUrl || 'https://homehni.com/invoice'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Download Invoice</a>
            </p>
            <p style="background:#e8f5e8;padding:15px;border-left:4px solid #4caf50;margin:20px 0;">
              <strong>Note:</strong> Please keep this invoice for your records. You can access it anytime from your dashboard.
            </p>
            <p>Thank you for choosing Home HNI!</p>
            <p>Best regards,<br><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `📄 Your Home HNI Invoice

Hi ${userName || 'there'},

Thank you for your payment! Here's your invoice for the selected plan.

Invoice Details:
${planName || 'Premium Plan'} - ₹${amount || 'N/A'}
Transaction ID: ${transactionId || 'N/A'}
Payment Date: ${new Date().toLocaleDateString()}
Total Amount: ₹${amount || 'N/A'}

Plan Features:
${planDetails || '• Enhanced property visibility\n• Priority customer support\n• Advanced analytics\n• Direct owner contact'}

Download invoice: ${invoiceUrl || 'https://homehni.com/invoice'}

Note: Please keep this invoice for your records. You can access it anytime from your dashboard.

Thank you for choosing Home HNI!

Best regards,
Team Home HNI

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 18. Services application email (Services tab form submission)
app.post("/send-services-application-email", async (req, res) => {
  const { to, userName, serviceType, applicationDetails } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "✅ Thank you for applying/booking – Our agents will contact you within 12 hours";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Service Application Received</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://i.postimg.cc/g0FsnQ5k/image.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">✅ Thank you for your ${serviceType || 'service'} request</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for applying/booking <strong>${serviceType || 'service'}</strong>. <strong>Our agents will contact you within 12 hours</strong> to confirm details.</p>
            <p style="background:#e8f5e8;padding:15px;border-left:4px solid #4caf50;margin:20px 0;">
              <strong>Application Details:</strong><br>
              🎯 Service: ${serviceType || 'Selected Service'}<br>
              📅 Application Date: ${new Date().toLocaleString()}<br>
              📋 Status: Under Review
            </p>
            <p><strong>What happens next?</strong></p>
            <ul style="padding-left:20px;margin:12px 0;">
              <li>📞 Our specialized agent will contact you within 12 hours</li>
              <li>💬 We'll discuss your specific requirements</li>
              <li>📋 Provide you with a customized service plan</li>
              <li>✅ Schedule the service at your convenience</li>
            </ul>
            <p style="background:#e3f2fd;padding:15px;border-left:4px solid #2196f3;margin:20px 0;">
              <strong>Our Services Include:</strong><br>
              • 🏠 Property Management<br>
              • 🎨 Home Improvement & Renovation<br>
              • 🧹 Cleaning & Maintenance<br>
              • 📜 Legal & Documentation Support<br>
              • 🚚 Moving & Relocation Services
            </p>
            <p style="background:#fff3e0;padding:15px;border-left:4px solid #ff9800;margin:20px 0;">
              <strong>Why Choose Home HNI Services?</strong><br>
              • ✅ Verified and trusted service providers<br>
              • 💰 Competitive pricing<br>
              • 🛡️ Quality assurance and warranty<br>
              • 📞 24/7 customer support
            </p>
            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/services" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">👉 Explore More Services</a>
            </p>
            <p>We're excited to help you with your property needs!</p>
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

  const text = `🎯 Thank You for Your Service Application!

Hi ${userName || 'there'},

Thank you for applying for our ${serviceType || 'service'}! Our agents will contact you soon.

Application Details:
🎯 Service: ${serviceType || 'Selected Service'}
📅 Application Date: ${new Date().toLocaleString()}
📋 Status: Under Review

What happens next?
• 📞 Our specialized agent will contact you within 24 hours
• 💬 We'll discuss your specific requirements
• 📋 Provide you with a customized service plan
• ✅ Schedule the service at your convenience

Our Services Include:
• 🏠 Property Management
• 🎨 Home Improvement & Renovation
• 🧹 Cleaning & Maintenance
• 📜 Legal & Documentation Support
• 🚚 Moving & Relocation Services

Why Choose Home HNI Services?
• ✅ Verified and trusted service providers
• 💰 Competitive pricing
• 🛡️ Quality assurance and warranty
• 📞 24/7 customer support

Explore more services: https://homehni.com/services

We're excited to help you with your property needs!

Thanks,
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
