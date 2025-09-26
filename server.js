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
            <img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI" style="display:block;">
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
// Property listing live email
app.post("/send-listing-live-email", async (req, res) => {
  const { to, userName, price, bhkDetails, locality, phone, propertyUrl, planType } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🎉 Welcome to Home HNI! Your Premium Property is Now Live!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Welcome to Home HNI Premium</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:25px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="180" alt="Home HNI - Premium Property Platform"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 15px;color:#d32f2f;font-size:24px;">🎉 Welcome to Home HNI Premium!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p><strong>Congratulations!</strong> Your premium property is now live on <strong>Home HNI</strong> - India's most trusted property platform with zero brokerage.</p>
            
            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="margin:0 0 15px;color:#d32f2f;font-size:18px;">📋 Your Property Details</h3>
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                <tr><td style="padding:8px 0;"><strong>💰 Rent/Sale Price:</strong> ₹${price || 'N/A'}</td></tr>
                <tr><td style="padding:8px 0;"><strong>🏠 Property Type:</strong> ${bhkDetails || 'N/A'}</td></tr>
                <tr><td style="padding:8px 0;"><strong>📍 Locality:</strong> ${locality || 'N/A'}</td></tr>
                <tr><td style="padding:8px 0;"><strong>📞 Contact:</strong> ${phone || 'N/A'}</td></tr>
              </table>
            </div>

            <p>🚀 <strong>Your benefits with Home HNI Premium:</strong></p>
            <ul style="margin:15px 0;padding-left:20px;">
              <li>✅ Zero brokerage for tenants/buyers</li>
              <li>✅ Verified tenant/buyer connections</li>
              <li>✅ Dedicated relationship manager</li>
              <li>✅ Premium listing visibility</li>
              <li>✅ Professional documentation support</li>
            </ul>

            <p style="text-align:center;margin:30px 0;">
              <a href="${propertyUrl || 'https://homehni.com'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:6px;font-weight:bold;font-size:18px;display:inline-block;">👉 View My Premium Property</a>
            </p>

            <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:25px 0;">
              <h3 style="margin:0 0 15px;color:#2e7d32;font-size:18px;">🎯 Want Even Faster Results?</h3>
              <p style="margin:0;">Upgrade to our <strong>Diamond Plan</strong> for guaranteed tenant matching, personal field assistant, and 90-day validity!</p>
              <p style="text-align:center;margin:20px 0 10px;">
                <a href="https://homehni.com/plans?tab=owner" style="background:#2e7d32;color:#fff;text-decoration:none;padding:12px 24px;border-radius:5px;font-weight:bold;display:inline-block;">🔥 Upgrade Now</a>
              </p>
            </div>

            <p>💡 <strong>Pro Tip:</strong> Properties with premium plans get rented/sold <strong>3X faster</strong> with our enhanced visibility and dedicated support.</p>
            
            <p>Thanks,<br><strong>Team Home HNI</strong><br><em>India's Premium Property Platform</em></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:20px;font-size:14px;color:#777;">
          <p style="margin:0 0 10px;">© 2025 Home HNI - Premium Property Solutions</p>
          <p style="margin:0;"><a href="https://homehni.com/plans" style="color:#d32f2f;">View All Plans</a> | <a href="https://homehni.com/dashboard" style="color:#d32f2f;">My Dashboard</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🎉 Welcome to Home HNI Premium!

Hi ${userName || 'there'},

Congratulations! Your premium property is now live on Home HNI - India's most trusted property platform with zero brokerage.

Your Property Details:
• Rent/Sale Price: ₹${price || 'N/A'}
• Property Type: ${bhkDetails || 'N/A'}
• Locality: ${locality || 'N/A'}
• Contact: ${phone || 'N/A'}

Your benefits with Home HNI Premium:
✅ Zero brokerage for tenants/buyers
✅ Verified tenant/buyer connections
✅ Dedicated relationship manager
✅ Premium listing visibility
✅ Professional documentation support

View your property: ${propertyUrl || 'https://homehni.com'}

Want faster results? Upgrade to Diamond Plan for guaranteed tenant matching!
Upgrade: https://homehni.com/plans?tab=owner

Pro Tip: Premium plans get properties rented/sold 3X faster!

Thanks,
Team Home HNI
India's Premium Property Platform

© 2025 Home HNI`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 3. Price suggestions email
// 3. Price suggestions email
app.post("/send-price-suggestions-email", async (req, res) => {
  const { to, userName, locality, rangeMin, rangeMax, yourPrice, updatePriceUrl, propertyType = 'residential' } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "💰 Market Insights & Premium Plans for " + (locality || 'Your Area');
  
  // Define pricing plans based on property type
  const pricingPlans = {
    residential: [
      { name: "Starter", price: "₹299", duration: "7 days", features: ["Basic listing", "Standard visibility", "Email support"] },
      { name: "Professional", price: "₹599", duration: "15 days", features: ["Featured listing", "Priority placement", "WhatsApp support", "Analytics"] },
      { name: "Premium", price: "₹999", duration: "30 days", features: ["Top listing", "Maximum visibility", "Dedicated support", "Advanced analytics", "Social media promotion"] }
    ],
    commercial: [
      { name: "Business Basic", price: "₹799", duration: "10 days", features: ["Business listing", "Commercial visibility", "Email support"] },
      { name: "Business Pro", price: "₹1,499", duration: "20 days", features: ["Featured commercial listing", "Priority placement", "Business support", "Market insights"] },
      { name: "Enterprise", price: "₹2,499", duration: "45 days", features: ["Premium commercial listing", "Maximum exposure", "Dedicated account manager", "Custom marketing"] }
    ],
    industrial: [
      { name: "Industrial Basic", price: "₹1,299", duration: "15 days", features: ["Industrial listing", "Sector visibility", "Technical support"] },
      { name: "Industrial Pro", price: "₹2,299", duration: "30 days", features: ["Featured industrial listing", "Industry networks", "Expert consultation", "Market analysis"] },
      { name: "Industrial Elite", price: "₹3,999", duration: "60 days", features: ["Premium industrial listing", "Maximum industry reach", "Dedicated specialist", "Custom solutions"] }
    ],
    agricultural: [
      { name: "Farm Basic", price: "₹599", duration: "10 days", features: ["Agricultural listing", "Rural visibility", "Farmer support"] },
      { name: "Farm Pro", price: "₹1,199", duration: "25 days", features: ["Featured farm listing", "Agricultural networks", "Expert advice", "Crop insights"] },
      { name: "Agri Premium", price: "₹1,999", duration: "45 days", features: ["Premium agricultural listing", "Maximum rural reach", "Agricultural expert", "Market trends"] }
    ]
  };

  const currentPlans = pricingPlans[propertyType] || pricingPlans.residential;
  
  const plansHtml = currentPlans.map(plan => `
    <div style="border: 2px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 15px 0; text-align: center; background: #fff;">
      <h3 style="color: #d32f2f; margin: 0 0 10px; font-size: 20px;">${plan.name}</h3>
      <div style="font-size: 24px; font-weight: bold; color: #333; margin: 10px 0;">${plan.price}</div>
      <div style="color: #666; margin-bottom: 15px;">Valid for ${plan.duration}</div>
      <ul style="list-style: none; padding: 0; margin: 15px 0;">
        ${plan.features.map(feature => `<li style="padding: 5px 0; color: #555;">✓ ${feature}</li>`).join('')}
      </ul>
      <a href="${updatePriceUrl || 'https://homehni.com/plans'}" style="background: #d32f2f; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 10px;">Choose ${plan.name}</a>
    </div>
  `).join('');
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Market Insights & Premium Plans</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 20px;color:#d32f2f;font-size:24px;">💰 Market Insights for ${locality || 'Your Area'}</h2>
            <p>Hello ${userName || 'there'},</p>
            <p>Great news! We've analyzed recent market trends in <strong>${locality || 'your area'}</strong>.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
              <h3 style="margin: 0 0 10px; color: #d32f2f;">📊 Market Analysis</h3>
              <p style="margin: 5px 0;">Properties in your area recently closed between <strong>₹${rangeMin || 'N/A'} – ₹${rangeMax || 'N/A'}</strong></p>
              <p style="margin: 5px 0;">Your current listing price: <strong>₹${yourPrice || 'N/A'}</strong></p>
            </div>

            <h3 style="color: #d32f2f; margin: 30px 0 20px;">🚀 Boost Your Property's Visibility</h3>
            <p>Upgrade to our premium plans for <strong>3X faster results</strong> and maximum exposure:</p>
            
            ${plansHtml}
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h4 style="margin: 0 0 10px; color: #2e7d32;">🎯 Why Upgrade?</h4>
              <p style="margin: 5px 0;">✓ Premium listings get <strong>5X more views</strong></p>
              <p style="margin: 5px 0;">✓ Featured properties close <strong>3X faster</strong></p>
              <p style="margin: 5px 0;">✓ Priority customer support</p>
              <p style="margin: 5px 0;">✓ Advanced analytics & insights</p>
            </div>

            <p style="text-align:center;margin:30px 0;">
              <a href="${updatePriceUrl || 'https://homehni.com/plans'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:18px;display:inline-block;">🎯 Upgrade Now & Sell Faster</a>
            </p>
            
            <p>Need help choosing the right plan? Our property experts are here to assist!</p>
            <p><strong>Team Home HNI</strong><br>Your Premium Property Partner</p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Solutions</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Market Insights & Premium Plans for ${locality || 'Your Area'}

Hello ${userName || 'there'},

Great news! We've analyzed recent market trends in ${locality || 'your area'}.

Market Analysis:
Properties in your area recently closed between ₹${rangeMin || 'N/A'} – ₹${rangeMax || 'N/A'}
Your current listing price: ₹${yourPrice || 'N/A'}

Boost Your Property's Visibility:
Upgrade to our premium plans for 3X faster results and maximum exposure.

${currentPlans.map(plan => `
${plan.name} - ${plan.price} (${plan.duration})
${plan.features.map(feature => `• ${feature}`).join('\n')}
`).join('\n')}

Why Upgrade?
✓ Premium listings get 5X more views
✓ Featured properties close 3X faster  
✓ Priority customer support
✓ Advanced analytics & insights

Upgrade now: ${updatePriceUrl || 'https://homehni.com/plans'}

Team Home HNI
Your Premium Property Partner

© 2025 Home HNI - Premium Property Solutions`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 4. Loan enquiry email
app.post("/send-loan-enquiry-email", async (req, res) => {
  const { to, email, userEmail, userName, loanType, loanEligibilityUrl } = req.body;
  const resolvedTo = (to || email || userEmail || "").trim();
  const isValidEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(resolvedTo) && !/@example\.com$/i.test(resolvedTo);
  if (!isValidEmail) return res.status(400).json({ status: "error", error: "Invalid recipient email", resolvedTo });

  const normalizedType = String(loanType || 'Home Loan').trim();
  const typeMap = {
    'Home Loan': 'Home Loan',
    'Loan Against Property': 'Loan Against Property',
    'Balance Transfer': 'Balance Transfer',
    'Top-up Loan': 'Top-up Loan',
    'Construction Loan': 'Construction Loan',
    'Business Loan': 'Business Loan',
    'Others': 'Loan',
  };
  const displayType = typeMap[normalizedType] || normalizedType;

  const subject = `🏦 ${displayType} Application Received - Premium Loan Services by Home HNI`;
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Premium Loan Services Application</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 20px;color:#d32f2f;font-size:24px;">🏦 Welcome to Home HNI Premium Loan Services</h2>
            <p>Dear ${userName || 'Valued Customer'},</p>
            <p>Thank you for choosing <strong>Home HNI</strong> for your <strong>${displayType}</strong> requirements. We've successfully received your application and our premium loan specialists will contact you within <strong>4 hours</strong>.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
              <h3 style="margin: 0 0 15px; color: #d32f2f;">🎯 Your Premium Loan Benefits</h3>
              <p style="margin: 5px 0;">✓ <strong>Best Interest Rates:</strong> Exclusive rates through our banking partners</p>
              <p style="margin: 5px 0;">✓ <strong>Fast-Track Approval:</strong> 48-hour processing with Home HNI Premium</p>
              <p style="margin: 5px 0;">✓ <strong>Zero Processing Fees:</strong> Save up to ₹50,000 in hidden charges</p>
              <p style="margin: 5px 0;">✓ <strong>Dedicated Loan Advisor:</strong> Personal assistance throughout the process</p>
              <p style="margin: 5px 0;">✓ <strong>Document Support:</strong> Help with paperwork and compliance</p>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="margin: 0 0 10px; color: #1976d2;">📋 What Happens Next?</h4>
              <p style="margin: 8px 0;"><strong>Step 1:</strong> Our loan specialist contacts you within 4 hours</p>
              <p style="margin: 8px 0;"><strong>Step 2:</strong> Eligibility assessment and rate comparison</p>
              <p style="margin: 8px 0;"><strong>Step 3:</strong> Document collection and verification</p>
              <p style="margin: 8px 0;"><strong>Step 4:</strong> Fast-track approval and disbursement</p>
            </div>

            <p style="text-align:center;margin:30px 0;">
              <a href="${loanEligibilityUrl || 'https://homehni.com/loan-eligibility'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:18px;display:inline-block;">📊 Check Eligibility & Prepare Documents</a>
            </p>

            <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h4 style="margin: 0 0 10px; color: #f57c00;">🚀 Need Property Services Too?</h4>
              <p style="margin: 10px 0;">Upgrade to our <strong>Premium Property Plans</strong> for complete real estate solutions:</p>
              <p style="margin: 5px 0;">• Property search and verification services</p>
              <p style="margin: 5px 0;">• Legal documentation and registration support</p>
              <p style="margin: 5px 0;">• Property valuation and market insights</p>
              <a href="https://homehni.com/plans" style="background:#f57c00;color:#fff;text-decoration:none;padding:12px 24px;border-radius:5px;font-weight:bold;display:inline-block;margin-top:15px;">Explore Premium Plans</a>
            </div>
            
            <p>Thank you for choosing <strong>Home HNI</strong> - Your trusted partner for premium property and financial solutions.</p>
            <p><strong>Team Home HNI</strong><br>Premium Property & Loan Services</p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property & Financial Solutions</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🏦 Welcome to Home HNI Premium Loan Services

Dear ${userName || 'Valued Customer'},

Thank you for choosing Home HNI for your ${displayType} requirements. We've successfully received your application and our premium loan specialists will contact you within 4 hours.

Your Premium Loan Benefits:
✓ Best Interest Rates: Exclusive rates through our banking partners
✓ Fast-Track Approval: 48-hour processing with Home HNI Premium
✓ Zero Processing Fees: Save up to ₹50,000 in hidden charges
✓ Dedicated Loan Advisor: Personal assistance throughout the process
✓ Document Support: Help with paperwork and compliance

What Happens Next?
Step 1: Our loan specialist contacts you within 4 hours
Step 2: Eligibility assessment and rate comparison
Step 3: Document collection and verification
Step 4: Fast-track approval and disbursement

Check eligibility: ${loanEligibilityUrl || 'https://homehni.com/loan-eligibility'}

Need Property Services Too?
Upgrade to our Premium Property Plans: https://homehni.com/plans

Team Home HNI
Premium Property & Loan Services

© 2025 Home HNI - Premium Property & Financial Solutions`;

  const result = await sendEmail({ to: resolvedTo, subject, html, text });
  res.json(result);
});

// 5. Premium plan activated email
app.post("/send-plan-activated-email", async (req, res) => {
  const { to, userName, startUsingPlanUrl, planExpiryDate, planName = 'Premium' } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = `🎉 Welcome to Home HNI ${planName} - Your Premium Features Are Now Active!`;
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Premium Plan Activated</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 20px;color:#d32f2f;font-size:24px;">🎉 Welcome to Home HNI ${planName}!</h2>
            <p>Dear ${userName || 'Valued Customer'},</p>
            <p>Congratulations! Your <strong>Home HNI ${planName} Plan</strong> is now active and ready to supercharge your property journey.</p>
            
            <div style="background: #e8f5e8; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4caf50;">
              <h3 style="margin: 0 0 15px; color: #2e7d32;">🚀 Your Premium Features Are Now Live</h3>
              <p style="margin: 8px 0;">✅ <strong>Featured Listings:</strong> Your properties get 5X more visibility</p>
              <p style="margin: 8px 0;">✅ <strong>Priority Support:</strong> Dedicated customer success manager</p>
              <p style="margin: 8px 0;">✅ <strong>Advanced Analytics:</strong> Detailed insights on property performance</p>
              <p style="margin: 8px 0;">✅ <strong>Unlimited Contact Access:</strong> Connect with verified property seekers</p>
              <p style="margin: 8px 0;">✅ <strong>Premium Badge:</strong> Enhanced credibility and trust</p>
              <p style="margin: 8px 0;">✅ <strong>Early Access:</strong> New features and exclusive opportunities</p>
            </div>

            <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px; color: #7b1fa2;">💡 Pro Tips to Maximize Your Plan</h4>
              <p style="margin: 8px 0;">• Upload high-quality images for better engagement</p>
              <p style="margin: 8px 0;">• Use detailed descriptions with key amenities</p>
              <p style="margin: 8px 0;">• Update your property status regularly</p>
              <p style="margin: 8px 0;">• Respond quickly to inquiries for faster deals</p>
            </div>

            <p style="text-align:center;margin:30px 0;">
              <a href="${startUsingPlanUrl || 'https://homehni.com/dashboard'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:18px;display:inline-block;">🏠 Access My Premium Dashboard</a>
            </p>

            <div style="background: #fff8e1; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <p style="margin: 0 0 10px; font-weight: bold; color: #f57c00;">⏰ Plan Valid Till: ${planExpiryDate || 'N/A'}</p>
              <p style="margin: 10px 0; font-size: 14px; color: #666;">Get notified before expiry to continue enjoying premium benefits</p>
            </div>

            <div style="background: #e1f5fe; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="margin: 0 0 10px; color: #0277bd;">🎯 Need Additional Services?</h4>
              <p style="margin: 10px 0;">• Property photography and virtual tours</p>
              <p style="margin: 5px 0;">• Legal documentation and verification</p>
              <p style="margin: 5px 0;">• Home loans and financial services</p>
              <p style="margin: 5px 0;">• Property management solutions</p>
              <a href="https://homehni.com/services" style="background:#0277bd;color:#fff;text-decoration:none;padding:10px 20px;border-radius:5px;font-weight:bold;display:inline-block;margin-top:10px;">Explore Services</a>
            </div>
            
            <p>Thank you for choosing <strong>Home HNI ${planName}</strong>. We're committed to helping you achieve faster, better property deals.</p>
            <p><strong>Team Home HNI</strong><br>Your Premium Property Partner</p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Solutions</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🎉 Welcome to Home HNI ${planName}!

Dear ${userName || 'Valued Customer'},

Congratulations! Your Home HNI ${planName} Plan is now active and ready to supercharge your property journey.

Your Premium Features Are Now Live:
✅ Featured Listings: Your properties get 5X more visibility
✅ Priority Support: Dedicated customer success manager
✅ Advanced Analytics: Detailed insights on property performance
✅ Unlimited Contact Access: Connect with verified property seekers
✅ Premium Badge: Enhanced credibility and trust
✅ Early Access: New features and exclusive opportunities

Pro Tips to Maximize Your Plan:
• Upload high-quality images for better engagement
• Use detailed descriptions with key amenities
• Update your property status regularly
• Respond quickly to inquiries for faster deals

Access your dashboard: ${startUsingPlanUrl || 'https://homehni.com/dashboard'}

Plan Valid Till: ${planExpiryDate || 'N/A'}

Need Additional Services? https://homehni.com/services

Team Home HNI
Your Premium Property Partner

© 2025 Home HNI - Premium Property Solutions`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 6. Plan upgrade suggestion email
app.post("/send-plan-upgrade-email", async (req, res) => {
  const { to, userName, upgradePlanUrl, currentPlan = 'Basic' } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🚀 Unlock Premium Success - Upgrade Your Home HNI Plan Today!";
  
  const upgradeReasons = [
    { icon: "📈", title: "3X Faster Results", desc: "Premium listings close deals 3X faster than basic listings" },
    { icon: "👁️", title: "5X More Visibility", desc: "Featured placement gets your property seen by more buyers" },
    { icon: "🎯", title: "Priority Support", desc: "Get dedicated assistance from our property experts" },
    { icon: "📊", title: "Advanced Analytics", desc: "Track performance and optimize your listings" }
  ];

  const plans = [
    { name: "Professional", price: "₹599", duration: "15 days", highlight: false },
    { name: "Premium", price: "₹999", duration: "30 days", highlight: true },
    { name: "Elite", price: "₹1,499", duration: "45 days", highlight: false }
  ];

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Upgrade to Premium Success</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 20px;color:#d32f2f;font-size:24px;">🚀 Ready to Accelerate Your Property Success?</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>You're currently using our <strong>${currentPlan} Plan</strong>. While you're getting great results, our data shows that Premium users achieve significantly better outcomes.</p>
            
            <div style="background: linear-gradient(135deg, #fff3e0, #f3e5f5); padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin: 0 0 20px; color: #d32f2f; text-align: center;">🎯 Why Premium Users Win Big</h3>
              ${upgradeReasons.map(reason => `
                <div style="display: flex; align-items: center; margin: 15px 0;">
                  <span style="font-size: 24px; margin-right: 15px;">${reason.icon}</span>
                  <div>
                    <strong style="color: #d32f2f;">${reason.title}:</strong>
                    <span style="color: #555;"> ${reason.desc}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <h3 style="color: #d32f2f; margin: 30px 0 20px; text-align: center;">💎 Choose Your Premium Plan</h3>
            
            ${plans.map(plan => `
              <div style="border: ${plan.highlight ? '3px solid #d32f2f' : '2px solid #e0e0e0'}; border-radius: 8px; padding: 20px; margin: 15px 0; text-align: center; background: ${plan.highlight ? '#fff8f8' : '#fff'}; position: relative;">
                ${plan.highlight ? '<div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #d32f2f; color: white; padding: 5px 15px; border-radius: 15px; font-size: 12px; font-weight: bold;">MOST POPULAR</div>' : ''}
                <h4 style="color: #d32f2f; margin: 0 0 10px; font-size: 20px;">${plan.name}</h4>
                <div style="font-size: 28px; font-weight: bold; color: #333; margin: 10px 0;">${plan.price}</div>
                <div style="color: #666; margin-bottom: 15px;">Valid for ${plan.duration}</div>
                <a href="${upgradePlanUrl || `https://homehni.com/plans?upgrade=${plan.name.toLowerCase()}`}" style="background: ${plan.highlight ? '#d32f2f' : '#666'}; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 10px;">Upgrade to ${plan.name}</a>
              </div>
            `).join('')}

            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h4 style="margin: 0 0 10px; color: #2e7d32;">🔥 Limited Time Benefits</h4>
              <p style="margin: 8px 0;">✓ <strong>Free Property Photography</strong> worth ₹2,000</p>
              <p style="margin: 8px 0;">✓ <strong>Dedicated Account Manager</strong> for personalized support</p>
              <p style="margin: 8px 0;">✓ <strong>Legal Document Assistance</strong> for smooth transactions</p>
              <p style="margin: 8px 0;">✓ <strong>Market Insights Report</strong> for better pricing strategy</p>
            </div>

            <p style="text-align:center;margin:30px 0;">
              <a href="${upgradePlanUrl || 'https://homehni.com/plans'}" style="background:linear-gradient(135deg, #d32f2f, #f44336);color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:18px;display:inline-block;box-shadow:0 4px 12px rgba(211,47,47,0.3);">💎 Upgrade Now & Sell 3X Faster</a>
            </p>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #666; text-align: center;">
              <p style="margin: 0;">💬 Questions about upgrading? Our team is here to help!</p>
              <p style="margin: 5px 0;">Call us at <strong>+91 8074 017 388</strong> or reply to this email.</p>
            </div>
            
            <p>Don't let your property sit idle when you could be closing deals faster. Upgrade today!</p>
            <p><strong>Team Home HNI</strong><br>Your Success Partners</p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Accelerating Property Success</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🚀 Ready to Accelerate Your Property Success?

Hi ${userName || 'there'},

You're currently using our ${currentPlan} Plan. While you're getting great results, our data shows that Premium users achieve significantly better outcomes.

Why Premium Users Win Big:
📈 3X Faster Results: Premium listings close deals 3X faster
👁️ 5X More Visibility: Featured placement gets more buyers
🎯 Priority Support: Dedicated assistance from experts
📊 Advanced Analytics: Track and optimize performance

Choose Your Premium Plan:
• Professional: ₹599 (15 days)
• Premium: ₹999 (30 days) - MOST POPULAR
• Elite: ₹1,499 (45 days)

Limited Time Benefits:
✓ Free Property Photography worth ₹2,000
✓ Dedicated Account Manager for personalized support
✓ Legal Document Assistance for smooth transactions
✓ Market Insights Report for better pricing strategy

Upgrade now: ${upgradePlanUrl || 'https://homehni.com/plans'}

Questions? Call us at +91 8074 017 388

Team Home HNI
Your Success Partners

© 2025 Home HNI - Accelerating Property Success`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 7. Deal closed email
app.post("/send-deal-closed-email", async (req, res) => {
  const { to, userName, locality, dealType, postDealServicesUrl, propertyValue } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🎉 Congratulations! Your Property Deal is Successfully Closed with Home HNI";
  
  const services = [
    { icon: "🚚", title: "Professional Moving Services", desc: "Hassle-free packing and transportation", price: "Starting ₹5,000" },
    { icon: "🎨", title: "Deep Cleaning & Painting", desc: "Make your new place move-in ready", price: "Starting ₹8,000" },
    { icon: "📜", title: "Legal Documentation Support", desc: "Registration and agreement assistance", price: "Starting ₹15,000" },
    { icon: "🔧", title: "Home Renovation Services", desc: "Complete interior and exterior makeover", price: "Starting ₹25,000" },
    { icon: "🏠", title: "Property Management", desc: "Ongoing maintenance and tenant management", price: "Starting ₹2,000/month" },
    { icon: "💡", title: "Smart Home Solutions", desc: "Modern automation and security systems", price: "Starting ₹20,000" }
  ];

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Congratulations! Deal Successfully Closed</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="margin:0 0 10px;color:#d32f2f;font-size:28px;">🎉 Congratulations!</h2>
              <h3 style="margin:0 0 20px;color:#4caf50;font-size:20px;">Your Property Deal is Successfully Closed</h3>
            </div>
            
            <p>Dear ${userName || 'Valued Customer'},</p>
            <p>🏆 <strong>Fantastic news!</strong> Your property in <strong>${locality || 'your area'}</strong> has been successfully <strong>${dealType || 'sold/rented'}</strong> through Home HNI's premium platform.</p>
            
            ${propertyValue ? `
            <div style="background: linear-gradient(135deg, #e8f5e8, #f1f8e9); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border-left: 4px solid #4caf50;">
              <h4 style="margin: 0 0 10px; color: #2e7d32;">💰 Deal Summary</h4>
              <p style="margin: 5px 0; font-size: 18px;"><strong>Property Value: ₹${propertyValue}</strong></p>
              <p style="margin: 5px 0; color: #666;">Transaction completed through Home HNI Premium Services</p>
            </div>
            ` : ''}

            <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin: 0 0 15px; color: #f57c00; text-align: center;">🌟 Complete Your Property Journey</h3>
              <p style="text-align: center; margin-bottom: 20px;">Now that your deal is closed, let us help you with the next steps:</p>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
                ${services.map(service => `
                  <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; background: #fff; text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 8px;">${service.icon}</div>
                    <h5 style="margin: 0 0 8px; color: #d32f2f; font-size: 14px;">${service.title}</h5>
                    <p style="margin: 0 0 8px; font-size: 12px; color: #666;">${service.desc}</p>
                    <p style="margin: 0; font-size: 12px; font-weight: bold; color: #f57c00;">${service.price}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="margin: 0 0 15px; color: #1976d2;">🎯 Special Post-Deal Offers</h4>
              <p style="margin: 8px 0;">✅ <strong>20% Discount</strong> on all Home HNI services for closed deal customers</p>
              <p style="margin: 8px 0;">✅ <strong>Free Consultation</strong> for your next property investment</p>
              <p style="margin: 8px 0;">✅ <strong>Priority Booking</strong> for all premium services</p>
              <p style="margin: 8px 0;">✅ <strong>Exclusive Access</strong> to off-market property deals</p>
            </div>

            <p style="text-align:center;margin:30px 0;">
              <a href="${postDealServicesUrl || 'https://homehni.com/services'}" style="background:linear-gradient(135deg, #d32f2f, #f44336);color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:18px;display:inline-block;box-shadow:0 4px 12px rgba(211,47,47,0.3);">🛠️ Explore Post-Deal Services</a>
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h4 style="margin: 0 0 10px; color: #6c757d;">💬 We'd Love Your Feedback</h4>
              <p style="margin: 10px 0;">Your experience matters to us! Share your Home HNI journey and help others find their perfect property.</p>
              <a href="https://homehni.com/testimonials" style="background:#28a745;color:#fff;text-decoration:none;padding:10px 20px;border-radius:5px;font-weight:bold;display:inline-block;margin-top:10px;">Leave a Review</a>
            </div>

            <div style="background: #fce4ec; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h4 style="margin: 0 0 10px; color: #c2185b;">🏠 Planning Your Next Property Investment?</h4>
              <p style="margin: 10px 0;">Get exclusive access to premium properties and investment opportunities.</p>
              <a href="https://homehni.com/investment-properties" style="background:#c2185b;color:#fff;text-decoration:none;padding:12px 24px;border-radius:5px;font-weight:bold;display:inline-block;margin-top:10px;">Explore Investment Options</a>
            </div>
            
            <p>Once again, congratulations on your successful property transaction! We're thrilled to have been part of your journey and look forward to serving you again.</p>
            <p><strong>Warm regards,</strong><br><strong>Team Home HNI</strong><br>Your Trusted Property Partners</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
              <p><strong>Need immediate assistance?</strong></p>
              <p>📞 Call: +91 8074 017 388 | 📧 Email: homehni8@gmail.com</p>
            </div>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Your Trusted Property Partners</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🎉 Congratulations! Your Property Deal is Successfully Closed

Dear ${userName || 'Valued Customer'},

🏆 Fantastic news! Your property in ${locality || 'your area'} has been successfully ${dealType || 'sold/rented'} through Home HNI's premium platform.

${propertyValue ? `💰 Deal Summary: Property Value: ₹${propertyValue}` : ''}

Complete Your Property Journey:
Now that your deal is closed, let us help you with the next steps:

🚚 Professional Moving Services - Starting ₹5,000
🎨 Deep Cleaning & Painting - Starting ₹8,000  
📜 Legal Documentation Support - Starting ₹15,000
🔧 Home Renovation Services - Starting ₹25,000
🏠 Property Management - Starting ₹2,000/month
💡 Smart Home Solutions - Starting ₹20,000

Special Post-Deal Offers:
✅ 20% Discount on all Home HNI services
✅ Free Consultation for your next property investment
✅ Priority Booking for all premium services
✅ Exclusive Access to off-market property deals

Explore services: ${postDealServicesUrl || 'https://homehni.com/services'}

We'd Love Your Feedback: https://homehni.com/testimonials
Planning Next Investment? https://homehni.com/investment-properties

Need assistance?
📞 Call: +91 8074 017 388 | 📧 Email: homehni8@gmail.com

Warm regards,
Team Home HNI
Your Trusted Property Partners

© 2025 Home HNI - Your Trusted Property Partners`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 8. Help request email (Don't want to fill all details? Let us help you)
app.post("/send-help-request-email", async (req, res) => {
  const { to, userName, customerPhone, adminEmail } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🚀 Home HNI Premium Assistance - We'll Handle Everything!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Premium Property Posting Assistance</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🚀 Welcome to Home HNI Premium Property Services!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for choosing <strong>Home HNI's Premium Assistance</strong>! Sit back and relax - our expert team will handle your entire property listing process.</p>
            
            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 10px;font-size:18px;">🎯 Our Complete Service Package:</h3>
              <ul style="padding-left:20px;margin:10px 0;">
                <li>📞 <strong>Dedicated Agent Contact</strong> - Within 2 hours</li>
                <li>📝 <strong>Complete Property Details</strong> - We fill everything for you</li>
                <li>📸 <strong>Professional Photography</strong> - FREE HD photos & virtual tour</li>
                <li>🎯 <strong>Market Analysis</strong> - Optimal pricing suggestions</li>
                <li>✅ <strong>Premium Listing</strong> - Live within 4 hours with top visibility</li>
                <li>📱 <strong>Multi-platform Promotion</strong> - Featured across all channels</li>
              </ul>
            </div>

            <div style="background:#e8f5e8;padding:15px;border-left:4px solid #4caf50;margin:20px 0;">
              <strong>🏆 Why Choose Home HNI Premium?</strong><br>
              ✓ 3X faster property sales/rentals<br>
              ✓ Professional market positioning<br>
              ✓ Zero hassle, maximum results<br>
              ✓ Dedicated support throughout the process
            </div>

            <p style="background:#fff3cd;padding:15px;border-left:4px solid #ffc107;margin:20px 0;">
              <strong>📞 Your Dedicated Support Team:</strong><br>
              📱 WhatsApp Support: +91-9876543210<br>
              📧 Premium Email: premium@homehni.com<br>
              📞 Direct Line: ${customerPhone || 'Your registered number'}<br>
              🕐 Available: 9 AM - 9 PM (Mon-Sun)
            </p>

            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/dashboard" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 30px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">📊 Track My Listing</a>
              <a href="https://homehni.com/upgrade-premium" style="background:#4caf50;color:#fff;text-decoration:none;padding:14px 30px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">🚀 Upgrade to Elite</a>
            </p>

            <div style="background:#f0f8ff;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">🎁 Exclusive Premium Benefits</h4>
              <p style="margin:5px 0;font-size:14px;">• Priority customer support</p>
              <p style="margin:5px 0;font-size:14px;">• Professional property consultation</p>
              <p style="margin:5px 0;font-size:14px;">• Legal document assistance</p>
              <p style="margin:5px 0;font-size:14px;">• Post-sale/rental services</p>
            </div>

            <p>Get ready to experience the premium difference with Home HNI - where your property success is our commitment!</p>
            <p>Best regards,<br><strong>Home HNI Premium Team</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Services</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🚀 Welcome to Home HNI Premium Property Services!

Hi ${userName || 'there'},

Thank you for choosing Home HNI's Premium Assistance! Our expert team will handle your entire property listing process.

Our Complete Service Package:
• 📞 Dedicated Agent Contact - Within 2 hours
• 📝 Complete Property Details - We fill everything for you  
• 📸 Professional Photography - FREE HD photos & virtual tour
• 🎯 Market Analysis - Optimal pricing suggestions
• ✅ Premium Listing - Live within 4 hours with top visibility
• 📱 Multi-platform Promotion - Featured across all channels

Why Choose Home HNI Premium?
✓ 3X faster property sales/rentals
✓ Professional market positioning  
✓ Zero hassle, maximum results
✓ Dedicated support throughout the process

Your Dedicated Support Team:
📱 WhatsApp: +91-9876543210
📧 Email: premium@homehni.com
📞 Phone: ${customerPhone || 'Your registered number'}
🕐 Available: 9 AM - 9 PM (Mon-Sun)

Track your listing: https://homehni.com/dashboard
Upgrade to Elite: https://homehni.com/upgrade-premium

Get ready to experience the premium difference with Home HNI!

Best regards,
Home HNI Premium Team

© 2025 Home HNI - Premium Property Services`;

  const result = await sendEmail({ to, subject, html, text });
  
  // Enhanced admin notification
  if (adminEmail) {
    const adminSubject = "🚨 PRIORITY: Premium Help Request - Property Listing Assistance";
    const adminHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Priority Premium Help Request</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🚨 PRIORITY: Premium Help Request</h2>
            <p style="background:#fff3cd;padding:15px;border-left:4px solid #ffc107;margin:20px 0;">
              <strong>⏰ URGENT ACTION REQUIRED:</strong> Contact within 2 hours for premium service promise!
            </p>
            
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:20px 0;background:#f9f9f9;padding:20px;border-radius:8px;">
              <tr><td colspan="2" style="padding-bottom:15px;"><strong style="color:#d32f2f;font-size:16px;">Customer Details:</strong></td></tr>
              <tr><td style="padding:6px 0;width:30%;"><strong>Name:</strong></td><td>${userName || 'N/A'}</td></tr>
              <tr><td style="padding:6px 0;"><strong>Email:</strong></td><td>${to}</td></tr>
              <tr><td style="padding:6px 0;"><strong>Phone:</strong></td><td>${customerPhone || 'N/A'}</td></tr>
              <tr><td style="padding:6px 0;"><strong>Request Time:</strong></td><td>${new Date().toLocaleString()}</td></tr>
              <tr><td style="padding:6px 0;"><strong>Service Type:</strong></td><td>Premium Property Listing Assistance</td></tr>
            </table>

            <div style="background:#e8f5e8;padding:15px;border-left:4px solid #4caf50;margin:20px 0;">
              <strong>Required Actions:</strong><br>
              1. ☎️ Call customer within 2 hours<br>
              2. 📝 Complete property details collection<br>
              3. 📸 Schedule professional photography<br>
              4. 🎯 Provide market analysis & pricing<br>
              5. ✅ Ensure listing goes live within 4 hours<br>
              6. 📱 Set up multi-platform promotion
            </div>

            <p style="text-align:center;margin:28px 0;">
              <a href="tel:${customerPhone || ''}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 20px;border-radius:5px;font-weight:bold;font-size:14px;display:inline-block;margin-right:10px;">📞 Call Now</a>
              <a href="https://homehni.com/admin/customers" style="background:#4caf50;color:#fff;text-decoration:none;padding:14px 20px;border-radius:5px;font-weight:bold;font-size:14px;display:inline-block;">👤 View Profile</a>
            </p>

            <p>This is a premium service request. Ensure exceptional service delivery to maintain our premium reputation.</p>
            <p><strong>Home HNI Admin System</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI Admin Dashboard</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const adminText = `🚨 PRIORITY: Premium Help Request - Property Listing Assistance

⏰ URGENT ACTION REQUIRED: Contact within 2 hours for premium service promise!

Customer Details:
Name: ${userName || 'N/A'}
Email: ${to}
Phone: ${customerPhone || 'N/A'}
Request Time: ${new Date().toLocaleString()}
Service Type: Premium Property Listing Assistance

Required Actions:
1. ☎️ Call customer within 2 hours
2. 📝 Complete property details collection
3. 📸 Schedule professional photography
4. 🎯 Provide market analysis & pricing
5. ✅ Ensure listing goes live within 4 hours
6. 📱 Set up multi-platform promotion

This is a premium service request. Ensure exceptional service delivery.

Home HNI Admin System
© 2025 Home HNI Admin Dashboard`;

    await sendEmail({ to: adminEmail, subject: adminSubject, html: adminHtml, text: adminText });
  }
  
  res.json(result);
});

// 9. Freshly painted homes email
app.post("/send-freshly-painted-email", async (req, res) => {
  const { to, userName, propertyType, locality, budget } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🎨 Home HNI Premium Painting Services - Transform Your Property!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Premium Painting Services</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🎨 Transform Your Property with Home HNI Premium Painting!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Excellent choice! You've selected our <strong>"Freshly Painted Property"</strong> service - the secret to getting <strong>30% higher rent/sale value</strong> and <strong>50% faster deals</strong>!</p>

            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:18px;">🏆 Your Premium Painting Package Includes:</h3>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div style="padding:10px;background:#fff;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>🎨 Premium Paints</strong><br>
                  <small>Asian Paints, Berger Premium Range</small>
                </div>
                <div style="padding:10px;background:#fff;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>👨‍🎨 Expert Painters</strong><br>
                  <small>Certified professionals with 5+ years experience</small>
                </div>
                <div style="padding:10px;background:#fff;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>🛡️ 2-Year Warranty</strong><br>
                  <small>Complete coverage on workmanship</small>
                </div>
                <div style="padding:10px;background:#fff;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>🧹 Complete Cleanup</strong><br>
                  <small>Leave your property spotless</small>
                </div>
              </div>
            </div>

            <div style="background:#e8f5e8;padding:15px;border-left:4px solid #4caf50;margin:20px 0;">
              <strong>📞 What Happens Next?</strong><br>
              ⏰ Our painting specialist will contact you within <strong>6 hours</strong><br>
              📏 FREE on-site measurement and consultation<br>
              💰 Transparent pricing with no hidden costs<br>
              📅 Flexible scheduling to suit your timeline<br>
              ✅ Quality guaranteed with before/after photos
            </div>

            ${propertyType ? `
            <div style="background:#f0f8ff;padding:15px;border-left:4px solid #2196f3;margin:20px 0;">
              <strong>🏠 Your Property Details:</strong><br>
              Property Type: ${propertyType}<br>
              ${locality ? `Location: ${locality}<br>` : ''}
              ${budget ? `Budget Range: ₹${budget}<br>` : ''}
              Service: Premium Painting & Touch-up
            </div>
            ` : ''}

            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/services/painting" style="background:#d32f2f;color:#fff;text-decoration:none;padding:14px 25px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">🎨 View Painting Gallery</a>
              <a href="https://homehni.com/get-quote" style="background:#4caf50;color:#fff;text-decoration:none;padding:14px 25px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">💰 Get Instant Quote</a>
            </p>

            <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">🎁 Limited Time Offer!</h4>
              <p style="margin:5px 0;font-size:16px;"><strong>Book within 48 hours and get:</strong></p>
              <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ 15% OFF on painting costs</p>
              <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ FREE primer coat worth ₹5,000</p>
              <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ Complimentary minor repairs</p>
            </div>

            <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📞 Connect with Our Painting Experts:</h4>
              <p style="margin:5px 0;">📱 WhatsApp: +91-9876543210 (Instant quotes)</p>
              <p style="margin:5px 0;">📧 Email: painting@homehni.com</p>
              <p style="margin:5px 0;">⏰ Available: 8 AM - 8 PM (Mon-Sun)</p>
              <p style="margin:5px 0;">🚗 Service Areas: All major cities</p>
            </div>

            <p>Transform your property into a premium showcase that attracts the best buyers and tenants. Our fresh paint finish will make your property stand out in the competitive market!</p>
            <p>Ready to increase your property value?<br><strong>Home HNI Painting Services Team</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Services</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🎨 Transform Your Property with Home HNI Premium Painting!

Hi ${userName || 'there'},

Excellent choice! You've selected our "Freshly Painted Property" service - get 30% higher value and 50% faster deals!

Your Premium Painting Package:
• 🎨 Premium Paints (Asian Paints, Berger Premium)
• 👨‍🎨 Expert Certified Painters (5+ years exp)
• 🛡️ 2-Year Warranty on workmanship
• 🧹 Complete cleanup included

What Happens Next?
⏰ Painting specialist contact within 6 hours
📏 FREE on-site measurement & consultation
💰 Transparent pricing, no hidden costs
📅 Flexible scheduling
✅ Quality guaranteed with before/after photos

${propertyType ? `
Your Property Details:
Property Type: ${propertyType}
${locality ? `Location: ${locality}` : ''}
${budget ? `Budget Range: ₹${budget}` : ''}
Service: Premium Painting & Touch-up
` : ''}

🎁 Limited Time Offer (48 hours):
✓ 15% OFF on painting costs
✓ FREE primer coat worth ₹5,000  
✓ Complimentary minor repairs

Connect with Our Experts:
📱 WhatsApp: +91-9876543210
📧 Email: painting@homehni.com
⏰ Available: 8 AM - 8 PM (Mon-Sun)

View Gallery: https://homehni.com/services/painting
Get Quote: https://homehni.com/get-quote

Transform your property into a premium showcase!

Home HNI Painting Services Team
© 2025 Home HNI - Premium Property Services`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result); 
});

// 10. Property submitted email (Submit property trigger)
app.post("/send-property-submitted-email", async (req, res) => {
  const { to, userName, propertyType, locality, propertyValue, pricingPlanUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🎉 Welcome to Home HNI Premium! Your Property is Under Review";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Welcome to Home HNI Premium</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🎉 Welcome to Home HNI Premium Property Services!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Congratulations! You've successfully submitted your <strong>${propertyType || 'premium property'}</strong> to India's most trusted property platform. Your property is now in our expert review queue.</p>

            ${locality || propertyValue ? `
            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 10px;font-size:16px;">📋 Your Property Summary:</h3>
              <p style="margin:5px 0;"><strong>Property Type:</strong> ${propertyType || 'Premium Property'}</p>
              ${locality ? `<p style="margin:5px 0;"><strong>Location:</strong> ${locality}</p>` : ''}
              ${propertyValue ? `<p style="margin:5px 0;"><strong>Value:</strong> ₹${propertyValue}</p>` : ''}
              <p style="margin:5px 0;"><strong>Status:</strong> <span style="color:#ff9800;">Under Premium Review</span></p>
            </div>
            ` : ''}

            <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:18px;">⚡ What Happens Next? (Premium Process)</h3>
              <ul style="padding-left:20px;margin:10px 0;">
                <li>🔍 <strong>Expert Review (6-8 hours):</strong> Our property specialists verify all details</li>
                <li>📸 <strong>Photo Enhancement:</strong> Professional touch-ups for maximum appeal</li>
                <li>🎯 <strong>Market Analysis:</strong> Optimal pricing & positioning recommendations</li>
                <li>✅ <strong>Premium Go-Live:</strong> Featured placement across all channels</li>
                <li>📱 <strong>Instant Notifications:</strong> Real-time updates on interest & inquiries</li>
              </ul>
            </div>

            <div style="background:#f0f8ff;padding:25px;border-radius:8px;margin:20px 0;text-align:center;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:18px;">🚀 Boost Your Property's Performance!</h3>
              <p style="margin:10px 0;">Upgrade now and get <strong>3X more visibility</strong> + <strong>50% faster deals</strong></p>
              
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;margin:20px 0;">
                <div style="background:#fff;padding:15px;border-radius:8px;border:2px solid #e0e0e0;">
                  <h4 style="color:#4caf50;margin:0 0 8px;font-size:14px;">FREE</h4>
                  <p style="margin:0;font-size:12px;font-weight:bold;">Basic Listing</p>
                  <p style="margin:5px 0;font-size:11px;">Standard visibility</p>
                  <p style="margin:5px 0;font-size:11px;">30-day listing</p>
                </div>
                <div style="background:#fff;padding:15px;border-radius:8px;border:2px solid #ff9800;position:relative;">
                  <div style="background:#ff9800;color:#fff;padding:3px 8px;border-radius:3px;font-size:10px;position:absolute;top:-8px;left:50%;transform:translateX(-50%);">POPULAR</div>
                  <h4 style="color:#ff9800;margin:0 0 8px;font-size:14px;">₹${propertyType === 'Commercial' ? '1499' : propertyType === 'Industrial' ? '1999' : '999'}</h4>
                  <p style="margin:0;font-size:12px;font-weight:bold;">Premium Plan</p>
                  <p style="margin:5px 0;font-size:11px;">5X more visibility</p>
                  <p style="margin:5px 0;font-size:11px;">Verified contacts</p>
                  <p style="margin:5px 0;font-size:11px;">Priority support</p>
                </div>
                <div style="background:#fff;padding:15px;border-radius:8px;border:2px solid #d32f2f;">
                  <h4 style="color:#d32f2f;margin:0 0 8px;font-size:14px;">₹${propertyType === 'Commercial' ? '2499' : propertyType === 'Industrial' ? '2999' : '1999'}</h4>
                  <p style="margin:0;font-size:12px;font-weight:bold;">Elite Plan</p>
                  <p style="margin:5px 0;font-size:11px;">Featured listings</p>
                  <p style="margin:5px 0;font-size:11px;">Dedicated advisor</p>
                  <p style="margin:5px 0;font-size:11px;">Legal support</p>
                </div>
              </div>
            </div>

            <p style="text-align:center;margin:28px 0;">
              <a href="${pricingPlanUrl || 'https://homehni.com/plans?tab=seller'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">🚀 Upgrade Now</a>
              <a href="https://homehni.com/dashboard" style="background:#4caf50;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">📊 Track Status</a>
            </p>

            <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">🎁 Limited Time: First-Time Listing Bonus!</h4>
              <p style="margin:5px 0;color:#d32f2f;font-weight:bold;">Upgrade within 24 hours and get 20% OFF + FREE property photography!</p>
              <p style="margin:5px 0;font-size:14px;">Code: WELCOME20 (Auto-applied)</p>
            </div>

            <p>Get ready to experience the Home HNI advantage - where premium properties meet premium service!</p>
            <p>Best regards,<br><strong>Home HNI Premium Review Team</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Platform</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🎉 Welcome to Home HNI Premium Property Services!

Hi ${userName || 'there'},

Congratulations! You've successfully submitted your ${propertyType || 'premium property'} to India's most trusted property platform.

${locality || propertyValue ? `
Your Property Summary:
Property Type: ${propertyType || 'Premium Property'}
${locality ? `Location: ${locality}` : ''}
${propertyValue ? `Value: ₹${propertyValue}` : ''}
Status: Under Premium Review
` : ''}

What Happens Next? (Premium Process)
• 🔍 Expert Review (6-8 hours): Property specialists verify details
• 📸 Photo Enhancement: Professional touch-ups
• 🎯 Market Analysis: Optimal pricing recommendations  
• ✅ Premium Go-Live: Featured placement across channels
• 📱 Instant Notifications: Real-time updates on inquiries

Boost Your Property's Performance!
Upgrade now and get 3X more visibility + 50% faster deals

Plans Available:
FREE - Basic Listing (Standard visibility, 30 days)
₹${propertyType === 'Commercial' ? '1499' : propertyType === 'Industrial' ? '1999' : '999'} - Premium Plan (5X visibility, verified contacts, priority support)
₹${propertyType === 'Commercial' ? '2499' : propertyType === 'Industrial' ? '2999' : '1999'} - Elite Plan (Featured listings, dedicated advisor, legal support)

🎁 Limited Time Bonus: Upgrade within 24 hours - 20% OFF + FREE photography!
Code: WELCOME20

Upgrade: ${pricingPlanUrl || 'https://homehni.com/plans?tab=seller'}
Track Status: https://homehni.com/dashboard

Get ready to experience the Home HNI advantage!

Best regards,
Home HNI Premium Review Team
© 2025 Home HNI - Premium Property Platform`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 11. Property rejected email (Admin reject button)
app.post("/send-property-rejected-email", async (req, res) => {
  const { to, userName, rejectionReasons, propertyType, adminContact } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🔄 Home HNI Quality Check - Let's Perfect Your Property Listing!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Quality Check - Property Listing</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🔄 Let's Perfect Your Property Listing Together!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for choosing <strong>Home HNI Premium</strong>! Our quality review team has carefully examined your <strong>${propertyType || 'property'}</strong> listing to ensure it meets our premium standards.</p>

            <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">🎯 Quality Enhancement Opportunities:</h3>
              <div style="background:#fff;padding:15px;border-radius:5px;border-left:4px solid #ff9800;">
                ${rejectionReasons ? rejectionReasons.split('•').map(reason => reason.trim()).filter(reason => reason).map(reason => `<p style="margin:5px 0;">📝 ${reason}</p>`).join('') : `
                <p style="margin:5px 0;">📸 High-quality, well-lit property images needed</p>
                <p style="margin:5px 0;">📝 Enhanced property description with key highlights</p>
                <p style="margin:5px 0;">✅ Complete all required property details</p>
                <p style="margin:5px 0;">🏠 Add unique selling points and amenities</p>
                `}
              </div>
            </div>

            <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">🚀 How We'll Help You Succeed:</h3>
              <ul style="padding-left:20px;margin:10px 0;">
                <li>📞 <strong>Free Consultation Call:</strong> Our experts will guide you through improvements</li>
                <li>📸 <strong>Professional Photography:</strong> Available at special rates for rejected listings</li>
                <li>📝 <strong>Content Enhancement:</strong> We'll help craft compelling property descriptions</li>
                <li>✅ <strong>Fast-Track Re-Review:</strong> Priority review within 4 hours after resubmission</li>
              </ul>
            </div>

            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/dashboard/edit-property" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">✏️ Edit My Listing</a>
              <a href="https://homehni.com/contact-support" style="background:#4caf50;color:#fff;text-decoration:none;padding:16px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">💬 Get Expert Help</a>
            </p>

            <div style="background:#f0f8ff;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">🎁 Special Re-Listing Offer!</h4>
              <p style="margin:5px 0;">Fix your listing and upgrade to <strong>Premium Plan</strong> within 48 hours:</p>
              <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ Get 25% OFF premium plans</p>
              <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ FREE professional photo editing</p>
              <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ Guaranteed approval within 4 hours</p>
              <p style="margin:10px 0;font-size:14px;"><strong>Code: PERFECT25</strong> (Auto-applied)</p>
            </div>

            <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📞 Get Instant Expert Support:</h4>
              <p style="margin:5px 0;">📱 WhatsApp Support: +91-9876543210</p>
              <p style="margin:5px 0;">📧 Quality Team: quality@homehni.com</p>
              <p style="margin:5px 0;">⏰ Available: 9 AM - 9 PM (7 days a week)</p>
              <p style="margin:5px 0;">🎯 <strong>Average resolution time: 2 hours</strong></p>
            </div>

            <p><strong>Why We Care About Quality:</strong> Premium listings get 5X more views and close 3X faster. We want your property to be a success story!</p>
            <p>We're committed to helping you create the perfect listing. Let's work together to showcase your property at its absolute best!</p>
            <p>Looking forward to your successful re-submission,<br><strong>Home HNI Quality Assurance Team</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Excellence</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🔄 Let's Perfect Your Property Listing Together!

Hi ${userName || 'there'},

Thank you for choosing Home HNI Premium! Our quality team reviewed your ${propertyType || 'property'} listing to ensure premium standards.

Quality Enhancement Opportunities:
${rejectionReasons ? rejectionReasons : `
• 📸 High-quality, well-lit property images needed
• 📝 Enhanced property description with key highlights  
• ✅ Complete all required property details
• 🏠 Add unique selling points and amenities`}

How We'll Help You Succeed:
• 📞 Free Consultation Call: Expert guidance on improvements
• 📸 Professional Photography: Special rates for rejected listings
• 📝 Content Enhancement: Compelling property descriptions
• ✅ Fast-Track Re-Review: Priority review within 4 hours

🎁 Special Re-Listing Offer (48 hours):
✓ 25% OFF premium plans
✓ FREE professional photo editing
✓ Guaranteed approval within 4 hours
Code: PERFECT25

Get Expert Support:
📱 WhatsApp: +91-9876543210
📧 Email: quality@homehni.com  
⏰ Available: 9 AM - 9 PM (7 days)
🎯 Average resolution: 2 hours

Edit Listing: https://homehni.com/dashboard/edit-property
Get Help: https://homehni.com/contact-support

Premium listings get 5X more views and close 3X faster. Let's make your property a success story!

Home HNI Quality Assurance Team
© 2025 Home HNI - Premium Property Excellence`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 12. Show interest email (Show interest button trigger)  
app.post("/send-show-interest-email", async (req, res) => {
  const { to, email, userEmail, ownerEmail, userName, propertyType, locality, propertyPrice, pricingPlanUrl } = req.body;
  const resolvedTo = (to || email || userEmail || ownerEmail || "").trim();
  const isValidEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(resolvedTo) && !/@example\.com$/i.test(resolvedTo);
  if (!isValidEmail) {
    return res.status(400).json({ status: "error", error: "Invalid recipient email", resolvedTo });
  }

  const subject = "🏠 Unlock Premium Property Access - Exclusive Plans for Serious Buyers!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Premium Property Access Plans</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🏠 Welcome to Home HNI Premium Property Access!</h2>
            <p>Hi ${userName || 'Property Seeker'},</p>
            <p>Great choice! You've shown interest in premium properties on <strong>Home HNI</strong> - India's most trusted property platform. Now unlock exclusive access to connect directly with verified property owners!</p>

            ${propertyType || locality || propertyPrice ? `
            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 10px;font-size:16px;">🎯 Your Interest Profile:</h3>
              ${propertyType ? `<p style="margin:5px 0;"><strong>Property Type:</strong> ${propertyType}</p>` : ''}
              ${locality ? `<p style="margin:5px 0;"><strong>Preferred Location:</strong> ${locality}</p>` : ''}
              ${propertyPrice ? `<p style="margin:5px 0;"><strong>Budget Range:</strong> ₹${propertyPrice}</p>` : ''}
              <p style="margin:5px 0;"><strong>Status:</strong> <span style="color:#4caf50;">Ready to Connect!</span></p>
            </div>
            ` : ''}

            <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h3 style="color:#d32f2f;margin:0 0 10px;">🚀 Why Choose Home HNI Premium Access?</h3>
              <p style="margin:5px 0;font-weight:bold;color:#4caf50;">✓ Connect with 50,000+ verified property owners</p>
              <p style="margin:5px 0;font-weight:bold;color:#4caf50;">✓ Get responses 5X faster than competitors</p>
              <p style="margin:5px 0;font-weight:bold;color:#4caf50;">✓ Access exclusive off-market properties</p>
              <p style="margin:5px 0;font-weight:bold;color:#4caf50;">✓ Dedicated property advisor support</p>
            </div>

            <div style="background:#f0f8ff;padding:25px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 20px;text-align:center;font-size:18px;">💎 Choose Your Premium Access Plan:</h3>
              
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;margin:20px 0;">
                <div style="background:#fff;padding:20px;border-radius:8px;border:2px solid #e0e0e0;text-align:center;">
                  <h4 style="color:#4caf50;margin:0 0 10px;font-size:16px;">EXPLORER</h4>
                  <div style="font-size:24px;font-weight:bold;color:#4caf50;margin:10px 0;">FREE</div>
                  <ul style="text-align:left;padding-left:15px;margin:15px 0;font-size:13px;">
                    <li>View basic property details</li>
                    <li>Limited contact attempts (3/month)</li>
                    <li>Standard customer support</li>
                    <li>Access to public listings only</li>
                  </ul>
                  <p style="font-size:12px;color:#777;margin:10px 0;">Perfect for casual browsing</p>
                </div>
                
                <div style="background:#fff;padding:20px;border-radius:8px;border:2px solid:#ff9800;text-align:center;position:relative;">
                  <div style="background:#ff9800;color:#fff;padding:5px 10px;border-radius:15px;font-size:11px;position:absolute;top:-10px;left:50%;transform:translateX(-50%);font-weight:bold;">MOST POPULAR</div>
                  <h4 style="color:#ff9800;margin:0 0 10px;font-size:16px;">PREMIUM</h4>
                  <div style="font-size:24px;font-weight:bold;color:#ff9800;margin:10px 0;">₹${propertyType === 'Commercial' ? '799' : propertyType === 'Industrial' ? '999' : '499'}</div>
                  <div style="font-size:12px;color:#666;margin-bottom:15px;">per month</div>
                  <ul style="text-align:left;padding-left:15px;margin:15px 0;font-size:13px;">
                    <li>Unlimited property contacts</li>
                    <li>Direct owner phone numbers</li>
                    <li>Priority customer support</li>
                    <li>Access to exclusive listings</li>
                    <li>Property visit scheduling</li>
                    <li>Market price insights</li>
                  </ul>
                  <p style="font-size:12px;color:#777;margin:10px 0;">For serious property seekers</p>
                </div>
                
                <div style="background:#fff;padding:20px;border-radius:8px;border:2px solid:#d32f2f;text-align:center;">
                  <h4 style="color:#d32f2f;margin:0 0 10px;font-size:16px;">ELITE</h4>
                  <div style="font-size:24px;font-weight:bold;color:#d32f2f;margin:10px 0;">₹${propertyType === 'Commercial' ? '1499' : propertyType === 'Industrial' ? '1799' : '999'}</div>
                  <div style="font-size:12px;color:#666;margin-bottom:15px;">per month</div>
                  <ul style="text-align:left;padding-left:15px;margin:15px 0;font-size:13px;">
                    <li>Everything in Premium</li>
                    <li>Dedicated property advisor</li>
                    <li>Legal documentation help</li>
                    <li>Loan assistance & connections</li>
                    <li>Exclusive pre-launch access</li>
                    <li>Negotiation support</li>
                    <li>White-glove service</li>
                  </ul>
                  <p style="font-size:12px;color:#777;margin:10px 0;">VIP property buying experience</p>
                </div>
              </div>
            </div>

            <p style="text-align:center;margin:28px 0;">
              <a href="${pricingPlanUrl || 'https://homehni.com/plans?tab=buyer'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">🚀 Choose My Plan</a>
              <a href="https://homehni.com/properties/search" style="background:#4caf50;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">🔍 Browse Properties</a>
            </p>

            <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">🎁 Limited Time: New Member Special!</h4>
              <p style="margin:5px 0;"><strong>Sign up for any premium plan within 24 hours and get:</strong></p>
              <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ 30% OFF first month (Code: NEWMEMBER30)</p>
              <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ FREE property market report for your area</p>
              <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ Priority access to new listings</p>
            </div>

            <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📞 Need Help Choosing?</h4>
              <p style="margin:5px 0;">📱 WhatsApp Advisor: +91-9876543210</p>
              <p style="margin:5px 0;">📧 Premium Support: premium@homehni.com</p>
              <p style="margin:5px 0;">⏰ Available: 9 AM - 9 PM (Mon-Sun)</p>
              <p style="margin:5px 0;">🎯 <strong>Free consultation call available!</strong></p>
            </div>

            <p>Join thousands of satisfied property buyers who found their dream homes through Home HNI Premium. Your perfect property is just a click away!</p>
            <p>Ready to unlock premium access?<br><strong>Home HNI Premium Access Team</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Access</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🏠 Welcome to Home HNI Premium Property Access!

Hi ${userName || 'Property Seeker'},

Great choice! You've shown interest in premium properties on Home HNI. Unlock exclusive access to connect directly with verified property owners!

${propertyType || locality || propertyPrice ? `
Your Interest Profile:
${propertyType ? `Property Type: ${propertyType}` : ''}
${locality ? `Preferred Location: ${locality}` : ''}  
${propertyPrice ? `Budget Range: ₹${propertyPrice}` : ''}
Status: Ready to Connect!
` : ''}

Why Choose Home HNI Premium Access?
✓ Connect with 50,000+ verified property owners
✓ Get responses 5X faster than competitors
✓ Access exclusive off-market properties  
✓ Dedicated property advisor support

Choose Your Premium Access Plan:

EXPLORER - FREE
• View basic property details
• Limited contact attempts (3/month)
• Standard customer support
• Access to public listings only

PREMIUM - ₹${propertyType === 'Commercial' ? '799' : propertyType === 'Industrial' ? '999' : '499'}/month [MOST POPULAR]
• Unlimited property contacts
• Direct owner phone numbers  
• Priority customer support
• Access to exclusive listings
• Property visit scheduling
• Market price insights

ELITE - ₹${propertyType === 'Commercial' ? '1499' : propertyType === 'Industrial' ? '1799' : '999'}/month
• Everything in Premium
• Dedicated property advisor
• Legal documentation help
• Loan assistance & connections
• Exclusive pre-launch access
• Negotiation support
• White-glove service

🎁 New Member Special (24 hours):
✓ 30% OFF first month (Code: NEWMEMBER30)
✓ FREE property market report
✓ Priority access to new listings

Need Help Choosing?
📱 WhatsApp: +91-9876543210
📧 Email: premium@homehni.com
⏰ Available: 9 AM - 9 PM (Mon-Sun)

Choose Plan: ${pricingPlanUrl || 'https://homehni.com/plans?tab=buyer'}
Browse Properties: https://homehni.com/properties/search

Your perfect property is just a click away!

Home HNI Premium Access Team
© 2025 Home HNI - Premium Property Access`;

  const result = await sendEmail({ to: resolvedTo, subject, html, text });
  res.json(result);
});

// 13. Mark as rented/sold email
app.post("/send-mark-rented-sold-email", async (req, res) => {
  const { to, userName, propertyType, status, locality, finalPrice, dealDuration } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const dealType = status === 'sold' ? 'Sale' : status === 'rented' ? 'Rental' : 'Deal';
  const subject = `🎉 Congratulations! Your ${propertyType || 'Property'} ${dealType} is Complete!`;
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Property Deal Successful</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🎉 Congratulations on Your Successful ${dealType}!</h2>
            <p>Dear ${userName || 'Valued Customer'},</p>
            <p>🥳 <strong>Fantastic news!</strong> Your ${propertyType || 'property'} has been successfully <strong>${status || 'closed'}</strong> through Home HNI's premium platform!</p>

            ${locality || finalPrice || dealDuration ? `
            <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">📋 ${dealType} Summary:</h3>
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                <tr><td style="padding:8px 0;width:40%;"><strong>Property Type:</strong></td><td>${propertyType || 'Premium Property'}</td></tr>
                ${locality ? `<tr><td style="padding:8px 0;"><strong>Location:</strong></td><td>${locality}</td></tr>` : ''}
                ${finalPrice ? `<tr><td style="padding:8px 0;"><strong>${dealType} Price:</strong></td><td>₹${finalPrice}</td></tr>` : ''}
                ${dealDuration ? `<tr><td style="padding:8px 0;"><strong>Time to Close:</strong></td><td>${dealDuration} days</td></tr>` : ''}
                <tr><td style="padding:8px 0;"><strong>Status:</strong></td><td><span style="color:#4caf50;font-weight:bold;">✅ ${dealType} Complete</span></td></tr>
              </table>
            </div>
            ` : ''}

            <div style="background:#f0f8ff;padding:25px;border-radius:8px;margin:20px 0;text-align:center;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:18px;">🏆 Success Story Achieved!</h3>
              <p style="margin:10px 0;font-size:16px;">You've joined our community of successful property owners who trust Home HNI for premium results!</p>
              <div style="background:#fff;padding:15px;border-radius:5px;margin:15px 0;">
                <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ Average ${dealType.toLowerCase()} time: ${dealDuration ? `${dealDuration} days` : '45 days faster'} than market average</p>
                <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ Premium platform advantage achieved</p>
                <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ Professional service delivery completed</p>
              </div>
            </div>

            <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">🎁 Exclusive Post-${dealType} Services:</h3>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>🚚 Premium Moving Services</strong><br>
                  <small>Professional packing, moving & unpacking</small><br>
                  <span style="color:#4caf50;font-weight:bold;">20% OFF for Home HNI customers</span>
                </div>
                <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid:#4caf50;">
                  <strong>🎨 Property Makeover</strong><br>
                  <small>Painting, cleaning & home staging</small><br>
                  <span style="color:#4caf50;font-weight:bold;">Special rates available</span>
                </div>
                <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid:#4caf50;">
                  <strong>📜 Legal Support</strong><br>
                  <small>Documentation & agreement assistance</small><br>
                  <span style="color:#4caf50;font-weight:bold;">FREE consultation included</span>
                </div>
                <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid:#4caf50;">
                  <strong>💰 Investment Advisory</strong><br>
                  <small>Next property investment guidance</small><br>
                  <span style="color:#4caf50;font-weight:bold;">Exclusive member rates</span>
                </div>
              </div>
            </div>

            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/services/post-deal" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 25px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">🛍️ Explore Services</a>
              <a href="https://homehni.com/list-new-property" style="background:#4caf50;color:#fff;text-decoration:none;padding:16px 25px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">🏠 List Next Property</a>
            </p>

            <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">💝 Thank You Bonus!</h4>
              <p style="margin:5px 0;">As a token of appreciation for your successful deal:</p>
              <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ FREE premium listing for your next property (₹1999 value)</p>
              <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ VIP customer status with priority support</p>
              <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ Exclusive access to off-market properties</p>
              <p style="margin:10px 0;font-size:14px;"><strong>Valid for 6 months</strong></p>
            </div>

            <div style="background:#e3f2fd;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📞 Your Dedicated Success Team:</h4>
              <p style="margin:5px 0;">📱 WhatsApp VIP Line: +91-9876543210</p>
              <p style="margin:5px 0;">📧 VIP Email: vip@homehni.com</p>
              <p style="margin:5px 0;">⏰ Priority Support: 24/7 availability</p>
              <p style="margin:5px 0;">🎯 <strong>Your success manager will contact you within 24 hours</strong></p>
            </div>

            <p><strong>Help Us Celebrate Your Success!</strong> We'd love to hear about your Home HNI experience. Your success story could inspire thousands of other property owners!</p>
            <p style="text-align:center;margin:20px 0;">
              <a href="https://homehni.com/testimonials/add" style="background:#ff9800;color:#fff;text-decoration:none;padding:12px 25px;border-radius:5px;font-weight:bold;font-size:14px;display:inline-block;">⭐ Share Your Success Story</a>
            </p>

            <p>Thank you for trusting Home HNI with your property journey. Here's to your continued success and many more profitable deals ahead!</p>
            <p>Congratulations once again!<br><strong>Home HNI Success Team</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Success Platform</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🎉 Congratulations on Your Successful ${dealType}!

Dear ${userName || 'Valued Customer'},

🥳 Fantastic news! Your ${propertyType || 'property'} has been successfully ${status || 'closed'} through Home HNI's premium platform!

${locality || finalPrice || dealDuration ? `
${dealType} Summary:
Property Type: ${propertyType || 'Premium Property'}
${locality ? `Location: ${locality}` : ''}
${finalPrice ? `${dealType} Price: ₹${finalPrice}` : ''}
${dealDuration ? `Time to Close: ${dealDuration} days` : ''}
Status: ✅ ${dealType} Complete
` : ''}

Success Story Achieved!
✓ Average ${dealType.toLowerCase()} time: ${dealDuration ? `${dealDuration} days` : '45 days faster'} than market
✓ Premium platform advantage achieved
✓ Professional service delivery completed

Exclusive Post-${dealType} Services:
🚚 Premium Moving Services (20% OFF)
🎨 Property Makeover (Special rates)  
📜 Legal Support (FREE consultation)
💰 Investment Advisory (Exclusive rates)

Thank You Bonus!
✓ FREE premium listing for next property (₹1999 value)
✓ VIP customer status with priority support
✓ Exclusive access to off-market properties
Valid for 6 months

Your Dedicated Success Team:
📱 WhatsApp VIP: +91-9876543210
📧 VIP Email: vip@homehni.com
⏰ Priority Support: 24/7 available

Explore Services: https://homehni.com/services/post-deal
List Next Property: https://homehni.com/list-new-property
Share Success Story: https://homehni.com/testimonials/add

Thank you for trusting Home HNI with your property journey!

Home HNI Success Team
© 2025 Home HNI - Premium Property Success Platform`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});




// 14. Contact owner email (Contact owner button trigger)
app.post("/send-contact-owner-email", async (req, res) => {
  const { to, userName, propertyAddress, propertyType, interestedUserName, interestedUserEmail, interestedUserPhone, dashboardUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🔥 Hot Lead Alert! Premium Property Inquiry Received";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Premium Property Inquiry Received</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🔥 Hot Lead Alert! Someone Wants Your Property!</h2>
            <p>Hi ${userName || 'Property Owner'},</p>
            <p>🎉 <strong>Excellent news!</strong> A serious buyer is interested in your property and wants to connect with you directly through <strong>Home HNI Premium</strong>!</p>

            <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h3 style="color:#d32f2f;margin:0 0 10px;font-size:18px;">⚡ URGENT: High-Quality Lead!</h3>
              <p style="margin:5px 0;font-size:16px;font-weight:bold;">Respond within 2 hours for maximum conversion rate!</p>
            </div>

            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">🎯 Lead Details:</h3>
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                <tr><td style="padding:8px 0;width:40%;"><strong>Property:</strong></td><td>${propertyAddress || 'Your Premium Property'}</td></tr>
                <tr><td style="padding:8px 0;"><strong>Property Type:</strong></td><td>${propertyType || 'Premium Property'}</td></tr>
                <tr><td style="padding:8px 0;"><strong>Inquiry Time:</strong></td><td>${new Date().toLocaleString()}</td></tr>
                <tr><td style="padding:8px 0;"><strong>Lead Source:</strong></td><td>Home HNI Premium Platform</td></tr>
                <tr><td style="padding:8px 0;"><strong>Lead Quality:</strong></td><td><span style="color:#4caf50;font-weight:bold;">🔥 HOT LEAD</span></td></tr>
              </table>
            </div>

            ${interestedUserName || interestedUserEmail || interestedUserPhone ? `
            <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">👤 Interested Party Information:</h3>
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                ${interestedUserName ? `<tr><td style="padding:6px 0;width:30%;"><strong>Name:</strong></td><td>${interestedUserName}</td></tr>` : ''}
                ${interestedUserEmail ? `<tr><td style="padding:6px 0;"><strong>Email:</strong></td><td>${interestedUserEmail}</td></tr>` : ''}
                ${interestedUserPhone ? `<tr><td style="padding:6px 0;"><strong>Phone:</strong></td><td>${interestedUserPhone}</td></tr>` : ''}
                <tr><td style="padding:6px 0;"><strong>Verification:</strong></td><td><span style="color:#4caf50;">✅ Home HNI Verified User</span></td></tr>
              </table>
            </div>
            ` : ''}

            <div style="background:#f0f8ff;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">🚀 Recommended Next Steps:</h3>
              <ul style="padding-left:20px;margin:10px 0;">
                <li>📞 <strong>Call immediately</strong> - Strike while the iron is hot!</li>
                <li>📱 <strong>WhatsApp follow-up</strong> - Send property details & photos</li>
                <li>📅 <strong>Schedule site visit</strong> - Convert interest into commitment</li>
                <li>💼 <strong>Prepare documents</strong> - Have all papers ready for quick closure</li>
                <li>🎯 <strong>Negotiate smartly</strong> - Use Home HNI market insights</li>
              </ul>
            </div>

            <p style="text-align:center;margin:28px 0;">
              <a href="${dashboardUrl || 'https://homehni.com/dashboard/leads'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">👁️ View Full Lead Details</a>
              <a href="https://homehni.com/dashboard/responses" style="background:#4caf50;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">💬 Quick Response Tool</a>
            </p>

            <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">💡 Pro Tips for Higher Conversion:</h4>
              <p style="margin:5px 0;font-size:14px;">✓ Respond within 2 hours (75% higher conversion rate)</p>
              <p style="margin:5px 0;font-size:14px;">✓ Share additional property photos via WhatsApp</p>
              <p style="margin:5px 0;font-size:14px;">✓ Offer virtual tour or video call walkthrough</p>
              <p style="margin:5px 0;font-size:14px;">✓ Mention Home HNI premium verification for trust</p>
            </div>

            <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📞 Need Support? We're Here to Help!</h4>
              <p style="margin:5px 0;">📱 Owner Support WhatsApp: +91-9876543210</p>
              <p style="margin:5px 0;">📧 Premium Support: owners@homehni.com</p>
              <p style="margin:5px 0;">⏰ Available: 9 AM - 9 PM (Mon-Sun)</p>
              <p style="margin:5px 0;">🎯 <strong>Lead conversion coaching available!</strong></p>
            </div>

            <p><strong>Statistical Insight:</strong> Properties that respond to inquiries within 2 hours have a <span style="color:#4caf50;font-weight:bold;">75% higher chance</span> of conversion. Don't let this hot lead cool down!</p>
            <p>Best of luck with your property deal!<br><strong>Home HNI Lead Management Team</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Lead Generation Platform</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🔥 Hot Lead Alert! Someone Wants Your Property!

Hi ${userName || 'Property Owner'},

🎉 Excellent news! A serious buyer is interested in your property and wants to connect directly through Home HNI Premium!

⚡ URGENT: High-Quality Lead!
Respond within 2 hours for maximum conversion rate!

Lead Details:
Property: ${propertyAddress || 'Your Premium Property'}
Property Type: ${propertyType || 'Premium Property'}
Inquiry Time: ${new Date().toLocaleString()}
Lead Source: Home HNI Premium Platform
Lead Quality: 🔥 HOT LEAD

${interestedUserName || interestedUserEmail || interestedUserPhone ? `
Interested Party Information:
${interestedUserName ? `Name: ${interestedUserName}` : ''}
${interestedUserEmail ? `Email: ${interestedUserEmail}` : ''}
${interestedUserPhone ? `Phone: ${interestedUserPhone}` : ''}
Verification: ✅ Home HNI Verified User
` : ''}

Recommended Next Steps:
• 📞 Call immediately - Strike while the iron is hot!
• 📱 WhatsApp follow-up - Send property details & photos
• 📅 Schedule site visit - Convert interest into commitment
• 💼 Prepare documents - Have all papers ready
• 🎯 Negotiate smartly - Use Home HNI market insights

💡 Pro Tips for Higher Conversion:
✓ Respond within 2 hours (75% higher conversion)
✓ Share additional property photos via WhatsApp
✓ Offer virtual tour or video call walkthrough
✓ Mention Home HNI premium verification for trust

Need Support?
📱 WhatsApp: +91-9876543210
📧 Email: owners@homehni.com
⏰ Available: 9 AM - 9 PM (Mon-Sun)

View Lead Details: ${dashboardUrl || 'https://homehni.com/dashboard/leads'}
Quick Response: https://homehni.com/dashboard/responses

Properties that respond within 2 hours have 75% higher conversion rate!

Home HNI Lead Management Team
© 2025 Home HNI - Premium Lead Generation Platform`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 15. Visit scheduled email (Show Interest form submission)
app.post("/send-visit-scheduled-email", async (req, res) => {
  const { to, userName, propertyAddress, propertyType, visitorName, visitorPhone, visitorEmail, visitDate, visitTime, message } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🏠 Property Visit Scheduled - Prepare for Success!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Premium Property Visit Scheduled</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🏠 Property Visit Scheduled - Get Ready to Close!</h2>
            <p>Dear ${userName || 'Property Owner'},</p>
            <p>🎉 <strong>Outstanding news!</strong> You've got a confirmed property visit scheduled. This is your golden opportunity to convert interest into a successful deal!</p>

            <div style="background:#e8f5e8;padding:25px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;text-align:center;font-size:18px;">📅 Visit Appointment Details</h3>
              
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#fff;border-radius:5px;overflow:hidden;">
                <tr style="background:#f8f9fa;">
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;width:35%;"><strong>Property:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${propertyAddress || 'Your Premium Property'}</td>
                </tr>
                <tr>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Property Type:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${propertyType || 'Premium Property'}</td>
                </tr>
                <tr style="background:#f8f9fa;">
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Visitor Name:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${visitorName || 'Interested Buyer'}</td>
                </tr>
                <tr>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Contact Phone:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${visitorPhone || 'Available in dashboard'}</td>
                </tr>
                ${visitorEmail ? `
                <tr style="background:#f8f9fa;">
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Email:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${visitorEmail}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Visit Date:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><span style="color:#d32f2f;font-weight:bold;">${visitDate || 'To be confirmed'}</span></td>
                </tr>
                <tr style="background:#f8f9fa;">
                  <td style="padding:12px;"><strong>Visit Time:</strong></td>
                  <td style="padding:12px;"><span style="color:#d32f2f;font-weight:bold;">${visitTime || 'To be confirmed'}</span></td>
                </tr>
              </table>
              
              ${message ? `
              <div style="background:#fff3cd;padding:15px;border-radius:5px;margin:15px 0;">
                <strong>📝 Special Message from Visitor:</strong><br>
                "${message}"
              </div>
              ` : ''}
            </div>

            <div style="background:#f0f8ff;padding:25px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:18px;">🎯 Pre-Visit Success Checklist:</h3>
              
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>🏠 Property Preparation</strong><br>
                  <small>• Deep clean all rooms<br>• Enhance lighting & ventilation<br>• Remove clutter & personal items<br>• Fix minor repairs if any</small>
                </div>
                <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>📋 Documentation Ready</strong><br>
                  <small>• Property documents<br>• NOC certificates<br>• Recent photos/videos<br>• Price negotiation strategy</small>
                </div>
                <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>🗣️ Communication Prep</strong><br>
                  <small>• Highlight unique features<br>• Know neighborhood benefits<br>• Prepare FAQs answers<br>• Set clear next steps</small>
                </div>
                <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>🤝 Closing Strategy</strong><br>
                  <small>• Know your bottom price<br>• Flexible payment terms<br>• Quick decision incentives<br>• Follow-up plan ready</small>
                </div>
              </div>
            </div>

            <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">⚡ Visit Day Success Tips:</h4>
              <p style="margin:5px 0;font-weight:bold;">✓ Arrive 15 minutes early to prepare</p>
              <p style="margin:5px 0;font-weight:bold;">✓ Greet warmly & build rapport first</p>
              <p style="margin:5px 0;font-weight:bold;">✓ Share neighborhood stories & benefits</p>
              <p style="margin:5px 0;font-weight:bold;">✓ Address concerns proactively</p>
              <p style="margin:5px 0;font-weight:bold;">✓ Ask for commitment before they leave</p>
            </div>

            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/dashboard/visits" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 25px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">📅 Manage Visits</a>
              <a href="https://homehni.com/visit-preparation-guide" style="background:#4caf50;color:#fff;text-decoration:none;padding:16px 25px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">📖 Visit Guide</a>
            </p>

            <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📞 Visit Day Support Available:</h4>
              <p style="margin:5px 0;">📱 Emergency Support: +91-9876543210</p>
              <p style="margin:5px 0;">📧 Visit Coordinator: visits@homehni.com</p>
              <p style="margin:5px 0;">⏰ Available: 24/7 on visit days</p>
              <p style="margin:5px 0;">🎯 <strong>Call us if visitor doesn't show up!</strong></p>
            </div>

            <p><strong>Statistical Fact:</strong> Well-prepared property visits have an <span style="color:#4caf50;font-weight:bold;">85% higher conversion rate</span>. You're just one great visit away from closing your deal!</p>
            <p>Wishing you a successful property visit and deal closure!<br><strong>Home HNI Visit Coordination Team</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Visit Management</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🏠 Property Visit Scheduled - Get Ready to Close!

Dear ${userName || 'Property Owner'},

🎉 Outstanding news! You've got a confirmed property visit scheduled. This is your opportunity to convert interest into a successful deal!

📅 Visit Appointment Details:
Property: ${propertyAddress || 'Your Premium Property'}
Property Type: ${propertyType || 'Premium Property'}
Visitor Name: ${visitorName || 'Interested Buyer'}
Contact Phone: ${visitorPhone || 'Available in dashboard'}
${visitorEmail ? `Email: ${visitorEmail}` : ''}
Visit Date: ${visitDate || 'To be confirmed'}
Visit Time: ${visitTime || 'To be confirmed'}

${message ? `📝 Special Message from Visitor: "${message}"` : ''}

🎯 Pre-Visit Success Checklist:

🏠 Property Preparation:
• Deep clean all rooms
• Enhance lighting & ventilation  
• Remove clutter & personal items
• Fix minor repairs if any

📋 Documentation Ready:
• Property documents
• NOC certificates
• Recent photos/videos
• Price negotiation strategy

🗣️ Communication Prep:
• Highlight unique features
• Know neighborhood benefits
• Prepare FAQs answers
• Set clear next steps

🤝 Closing Strategy:
• Know your bottom price
• Flexible payment terms
• Quick decision incentives
• Follow-up plan ready

⚡ Visit Day Success Tips:
✓ Arrive 15 minutes early to prepare
✓ Greet warmly & build rapport first
✓ Share neighborhood stories & benefits
✓ Address concerns proactively
✓ Ask for commitment before they leave

Visit Day Support:
📱 Emergency Support: +91-9876543210
📧 Visit Coordinator: visits@homehni.com
⏰ Available: 24/7 on visit days

Manage Visits: https://homehni.com/dashboard/visits
Visit Guide: https://homehni.com/visit-preparation-guide

Well-prepared visits have 85% higher conversion rate!

Home HNI Visit Coordination Team
© 2025 Home HNI - Premium Property Visit Management`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 16. Payment success email
app.post("/send-payment-success-email", async (req, res) => {
  const { to, userName, planName, planType, amount, transactionId, planDuration, nextBillingDate } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🎉 Welcome to Home HNI Premium! Payment Successful";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Welcome to Home HNI Premium</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🎉 Welcome to Home HNI Premium! Your Journey Begins Now</h2>
            <p>Hi ${userName || 'Valued Member'},</p>
            <p>🥳 <strong>Congratulations!</strong> Your payment has been successfully processed and you're now officially a <strong>Home HNI Premium member</strong>! Welcome to India's most exclusive property platform.</p>

            <div style="background:#e8f5e8;padding:25px;border-radius:8px;margin:20px 0;text-align:center;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:18px;">✅ Payment Confirmation</h3>
              
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#fff;border-radius:8px;overflow:hidden;margin:10px 0;">
                <tr style="background:#f8f9fa;">
                  <td style="padding:15px;border-bottom:1px solid #e0e0e0;width:40%;"><strong>Plan Selected:</strong></td>
                  <td style="padding:15px;border-bottom:1px solid #e0e0e0;color:#d32f2f;font-weight:bold;">${planName || 'Premium Plan'}</td>
                </tr>
                <tr>
                  <td style="padding:15px;border-bottom:1px solid #e0e0e0;"><strong>Plan Type:</strong></td>
                  <td style="padding:15px;border-bottom:1px solid #e0e0e0;">${planType || 'Monthly Subscription'}</td>
                </tr>
                <tr style="background:#f8f9fa;">
                  <td style="padding:15px;border-bottom:1px solid #e0e0e0;"><strong>Amount Paid:</strong></td>
                  <td style="padding:15px;border-bottom:1px solid #e0e0e0;color:#4caf50;font-weight:bold;">₹${amount || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding:15px;border-bottom:1px solid #e0e0e0;"><strong>Transaction ID:</strong></td>
                  <td style="padding:15px;border-bottom:1px solid #e0e0e0;font-family:monospace;">${transactionId || 'TXN_XXXXXXXX'}</td>
                </tr>
                <tr style="background:#f8f9fa;">
                  <td style="padding:15px;border-bottom:1px solid #e0e0e0;"><strong>Plan Duration:</strong></td>
                  <td style="padding:15px;border-bottom:1px solid #e0e0e0;">${planDuration || '30 days'}</td>
                </tr>
                <tr>
                  <td style="padding:15px;"><strong>Payment Date:</strong></td>
                  <td style="padding:15px;">${new Date().toLocaleDateString()}</td>
                </tr>
              </table>
            </div>

            <div style="background:#f0f8ff;padding:25px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 20px;text-align:center;font-size:18px;">🚀 Your Premium Benefits Are Now Active!</h3>
              
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>🎯 Enhanced Visibility</strong><br>
                  <small>• 5X more property views<br>• Featured listing placement<br>• Homepage highlighting<br>• Social media promotion</small>
                </div>
                <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>📞 Priority Support</strong><br>
                  <small>• Dedicated account manager<br>• 24/7 premium helpline<br>• WhatsApp priority support<br>• Same-day issue resolution</small>
                </div>
                <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>📊 Advanced Analytics</strong><br>
                  <small>• Detailed view statistics<br>• Lead conversion tracking<br>• Market price insights<br>• Competition analysis</small>
                </div>
                <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
                  <strong>🔗 Direct Connections</strong><br>
                  <small>• Unlimited verified contacts<br>• Direct owner connections<br>• Premium badge display<br>• Trust score enhancement</small>
                </div>
              </div>
            </div>

            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/dashboard/premium" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">🚀 Access Premium Dashboard</a>
              <a href="https://homehni.com/premium-guide" style="background:#4caf50;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">📖 Premium Guide</a>
            </p>

            <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">🎁 Exclusive Welcome Bonuses!</h4>
              <p style="margin:5px 0;color:#d32f2f;font-weight:bold;">✓ FREE professional property photography (₹2,000 value)</p>
              <p style="margin:5px 0;color:#d32f2f;font-weight:bold;">✓ FREE property description optimization</p>
              <p style="margin:5px 0;color:#d32f2f;font-weight:bold;">✓ Priority listing approval (under 2 hours)</p>
              <p style="margin:5px 0;color:#d32f2f;font-weight:bold;">✓ Dedicated success manager assignment</p>
            </div>

            <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📅 Important Subscription Details:</h4>
              <p style="margin:5px 0;">📧 <strong>Invoice:</strong> Detailed invoice sent to your email</p>
              <p style="margin:5px 0;">🔄 <strong>Auto-renewal:</strong> ${nextBillingDate ? `Next billing on ${nextBillingDate}` : 'Manage in dashboard settings'}</p>
              <p style="margin:5px 0;">⚙️ <strong>Manage Plan:</strong> Upgrade/downgrade anytime from dashboard</p>
              <p style="margin:5px 0;">📞 <strong>Premium Support:</strong> +91-9876543210 (VIP Line)</p>
            </div>

            <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">🎯 Quick Start Action Items:</h4>
              <ul style="padding-left:20px;margin:10px 0;">
                <li>📸 <strong>Upload premium photos</strong> - Use our free photography service</li>
                <li>📝 <strong>Optimize descriptions</strong> - Get free professional help</li>
                <li>🔍 <strong>Enable notifications</strong> - Never miss a lead or inquiry</li>
                <li>📊 <strong>Review analytics</strong> - Track your property performance</li>
                <li>🤝 <strong>Connect with manager</strong> - Schedule your success call</li>
              </ul>
            </div>

            <p><strong>What to Expect Next:</strong> Your dedicated success manager will contact you within 24 hours to help you maximize your premium benefits and achieve faster property sales/rentals.</p>
            <p>Thank you for choosing Home HNI Premium. Let's make your property dreams come true!<br><strong>Home HNI Premium Success Team</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Success Platform</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🎉 Welcome to Home HNI Premium! Your Journey Begins Now

Hi ${userName || 'Valued Member'},

🥳 Congratulations! Your payment has been successfully processed and you're now officially a Home HNI Premium member!

✅ Payment Confirmation:
Plan Selected: ${planName || 'Premium Plan'}
Plan Type: ${planType || 'Monthly Subscription'}
Amount Paid: ₹${amount || 'N/A'}
Transaction ID: ${transactionId || 'TXN_XXXXXXXX'}
Plan Duration: ${planDuration || '30 days'}
Payment Date: ${new Date().toLocaleDateString()}

🚀 Your Premium Benefits Are Now Active!

🎯 Enhanced Visibility:
• 5X more property views
• Featured listing placement
• Homepage highlighting
• Social media promotion

📞 Priority Support:
• Dedicated account manager
• 24/7 premium helpline
• WhatsApp priority support
• Same-day issue resolution

📊 Advanced Analytics:
• Detailed view statistics
• Lead conversion tracking
• Market price insights
• Competition analysis

🔗 Direct Connections:
• Unlimited verified contacts
• Direct owner connections
• Premium badge display
• Trust score enhancement

🎁 Exclusive Welcome Bonuses!
✓ FREE professional property photography (₹2,000 value)
✓ FREE property description optimization
✓ Priority listing approval (under 2 hours)
✓ Dedicated success manager assignment

📅 Subscription Details:
📧 Invoice sent to your email
🔄 Auto-renewal: ${nextBillingDate ? `Next billing on ${nextBillingDate}` : 'Manage in dashboard'}
⚙️ Manage plan anytime from dashboard
📞 Premium Support: +91-9876543210 (VIP Line)

🎯 Quick Start Actions:
• Upload premium photos with free service
• Optimize descriptions with professional help
• Enable notifications for leads
• Review analytics dashboard
• Connect with your success manager

Access Premium Dashboard: https://homehni.com/dashboard/premium
Premium Guide: https://homehni.com/premium-guide

Your success manager will contact you within 24 hours!

Home HNI Premium Success Team
© 2025 Home HNI - Premium Property Success Platform`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 17. Payment invoice email
app.post("/send-payment-invoice-email", async (req, res) => {
  const { to, userName, planName, planType, amount, transactionId, planDetails, invoiceNumber, taxAmount, totalAmount, invoiceUrl, billingAddress } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = `📄 Home HNI Invoice ${invoiceNumber || '#INV-' + Date.now()} - Payment Confirmation`;
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Home HNI Premium Invoice</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">📄 Official Invoice - Home HNI Premium Services</h2>
            <p>Dear ${userName || 'Valued Customer'},</p>
            <p>Thank you for your payment! Please find below your official invoice for Home HNI Premium services. This invoice serves as your payment confirmation and receipt.</p>

            <div style="background:#f8f9fa;padding:25px;border-radius:8px;margin:20px 0;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <div>
                  <h3 style="color:#d32f2f;margin:0;font-size:18px;">Invoice Details</h3>
                  <p style="margin:5px 0;color:#666;">Invoice Date: ${new Date().toLocaleDateString()}</p>
                </div>
                <div style="text-align:right;">
                  <h4 style="margin:0;color:#d32f2f;font-size:16px;">Invoice ${invoiceNumber || '#INV-' + Date.now()}</h4>
                  <p style="margin:5px 0;color:#666;">Transaction: ${transactionId || 'TXN_XXXXXXXX'}</p>
                </div>
              </div>

              ${billingAddress ? `
              <div style="background:#fff;padding:15px;border-radius:5px;margin:15px 0;">
                <h4 style="margin:0 0 10px;color:#333;">Bill To:</h4>
                <p style="margin:2px 0;">${userName || 'Customer Name'}</p>
                <p style="margin:2px 0;color:#666;">${billingAddress}</p>
              </div>
              ` : ''}
            </div>

            <div style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;margin:20px 0;overflow:hidden;">
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                <thead>
                  <tr style="background:#d32f2f;color:#fff;">
                    <th style="padding:15px;text-align:left;font-weight:bold;">Description</th>
                    <th style="padding:15px;text-align:center;font-weight:bold;">Duration</th>
                    <th style="padding:15px;text-align:right;font-weight:bold;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding:15px;border-bottom:1px solid #e0e0e0;">
                      <strong>${planName || 'Home HNI Premium Plan'}</strong><br>
                      <small style="color:#666;">${planType || 'Monthly Subscription'}</small>
                      ${planDetails ? `<br><small style="color:#888;">${planDetails}</small>` : ''}
                    </td>
                    <td style="padding:15px;border-bottom:1px solid #e0e0e0;text-align:center;">1 Month</td>
                    <td style="padding:15px;border-bottom:1px solid #e0e0e0;text-align:right;">₹${amount || '0'}</td>
                  </tr>
                  
                  <tr>
                    <td colspan="2" style="padding:15px;border-bottom:1px solid #e0e0e0;text-align:right;"><strong>Subtotal:</strong></td>
                    <td style="padding:15px;border-bottom:1px solid #e0e0e0;text-align:right;">₹${amount || '0'}</td>
                  </tr>
                  
                  ${taxAmount ? `
                  <tr>
                    <td colspan="2" style="padding:15px;border-bottom:1px solid #e0e0e0;text-align:right;">GST (18%):</td>
                    <td style="padding:15px;border-bottom:1px solid #e0e0e0;text-align:right;">₹${taxAmount}</td>
                  </tr>
                  ` : ''}
                  
                  <tr style="background:#f8f9fa;">
                    <td colspan="2" style="padding:15px;text-align:right;"><strong style="color:#d32f2f;font-size:16px;">Total Amount Paid:</strong></td>
                    <td style="padding:15px;text-align:right;"><strong style="color:#d32f2f;font-size:16px;">₹${totalAmount || amount || '0'}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">✅ Payment Status: PAID</h4>
              <p style="margin:5px 0;"><strong>Payment Method:</strong> Online Payment</p>
              <p style="margin:5px 0;"><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p style="margin:5px 0;"><strong>Transaction ID:</strong> ${transactionId || 'TXN_XXXXXXXX'}</p>
              <p style="margin:5px 0;"><strong>Status:</strong> <span style="color:#4caf50;font-weight:bold;">Successfully Processed</span></p>
            </div>

            <div style="background:#f0f8ff;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📋 Service Inclusions:</h4>
              <ul style="padding-left:20px;margin:10px 0;columns:2;column-gap:20px;">
                <li>Enhanced property visibility</li>
                <li>Featured listing placement</li>
                <li>Priority customer support</li>
                <li>Advanced analytics dashboard</li>
                <li>Unlimited verified contacts</li>
                <li>Direct owner connections</li>
                <li>Premium badge display</li>
                <li>Market insights access</li>
              </ul>
            </div>

            <p style="text-align:center;margin:28px 0;">
              <a href="${invoiceUrl || 'https://homehni.com/invoice'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 30px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">📥 Download Invoice</a>
              <a href="https://homehni.com/dashboard/billing" style="background:#4caf50;color:#fff;text-decoration:none;padding:16px 30px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">💳 Billing History</a>
            </p>

            <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📌 Important Notes:</h4>
              <ul style="padding-left:20px;margin:10px 0;">
                <li>Please retain this invoice for your accounting records</li>
                <li>Services are active immediately after payment confirmation</li>
                <li>For GST/Tax purposes, this serves as your official receipt</li>
                <li>Contact support for any billing inquiries or disputes</li>
              </ul>
            </div>

            <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📞 Billing Support:</h4>
              <p style="margin:5px 0;">📱 WhatsApp Support: +91-9876543210</p>
              <p style="margin:5px 0;">📧 Billing Email: billing@homehni.com</p>
              <p style="margin:5px 0;">⏰ Support Hours: 9 AM - 9 PM (Mon-Sun)</p>
              <p style="margin:5px 0;">🌐 Help Center: https://homehni.com/help</p>
            </div>

            <p>Thank you for choosing Home HNI Premium! We're committed to helping you achieve your property goals with our premium services.</p>
            <p>Best regards,<br><strong>Home HNI Billing & Accounts Team</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI Premium Services Pvt. Ltd. | GST: 27AAAAA0000A1Z5</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `📄 Home HNI Invoice ${invoiceNumber || '#INV-' + Date.now()} - Payment Confirmation

Dear ${userName || 'Valued Customer'},

Thank you for your payment! Please find below your official invoice for Home HNI Premium services.

Invoice Details:
Invoice: ${invoiceNumber || '#INV-' + Date.now()}
Invoice Date: ${new Date().toLocaleDateString()}
Transaction: ${transactionId || 'TXN_XXXXXXXX'}

${billingAddress ? `Bill To: ${userName || 'Customer Name'}\n${billingAddress}\n` : ''}

Service Details:
${planName || 'Home HNI Premium Plan'} - ${planType || 'Monthly Subscription'}
Duration: 1 Month
Amount: ₹${amount || '0'}

Subtotal: ₹${amount || '0'}
${taxAmount ? `GST (18%): ₹${taxAmount}\n` : ''}
Total Amount Paid: ₹${totalAmount || amount || '0'}

✅ Payment Status: PAID
Payment Method: Online Payment
Payment Date: ${new Date().toLocaleDateString()}
Transaction ID: ${transactionId || 'TXN_XXXXXXXX'}
Status: Successfully Processed

📋 Service Inclusions:
• Enhanced property visibility
• Featured listing placement
• Priority customer support
• Advanced analytics dashboard
• Unlimited verified contacts
• Direct owner connections
• Premium badge display
• Market insights access

📌 Important Notes:
• Please retain this invoice for your records
• Services are active immediately after payment
• This serves as your official GST receipt
• Contact support for billing inquiries

Billing Support:
📱 WhatsApp: +91-9876543210
📧 Email: billing@homehni.com
⏰ Hours: 9 AM - 9 PM (Mon-Sun)

Download Invoice: ${invoiceUrl || 'https://homehni.com/invoice'}
Billing History: https://homehni.com/dashboard/billing

Thank you for choosing Home HNI Premium!

Home HNI Billing & Accounts Team
© 2025 Home HNI Premium Services Pvt. Ltd. | GST: 27AAAAA0000A1Z5`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 18. Services application email (Services tab form submission)
app.post("/send-services-application-email", async (req, res) => {
  const { to, userName, serviceType, serviceCategory, propertyType, locality, budget, urgency, applicationDetails, contactPreference } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🎯 Home HNI Premium Services - Your Application is Confirmed!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Premium Services Application Confirmed</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🎯 Welcome to Home HNI Premium Services!</h2>
            <p>Dear ${userName || 'Valued Customer'},</p>
            <p>🎉 <strong>Excellent choice!</strong> Your application for <strong>${serviceType || 'Premium Property Services'}</strong> has been successfully received. You've just taken the first step towards experiencing India's most trusted property service network!</p>

            <div style="background:#e8f5e8;padding:25px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;text-align:center;font-size:18px;">📋 Your Service Application Summary</h3>
              
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#fff;border-radius:8px;overflow:hidden;">
                <tr style="background:#f8f9fa;">
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;width:35%;"><strong>Service Requested:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;color:#d32f2f;font-weight:bold;">${serviceType || 'Premium Property Service'}</td>
                </tr>
                ${serviceCategory ? `
                <tr>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Category:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${serviceCategory}</td>
                </tr>
                ` : ''}
                ${propertyType ? `
                <tr style="background:#f8f9fa;">
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Property Type:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${propertyType}</td>
                </tr>
                ` : ''}
                ${locality ? `
                <tr>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Location:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${locality}</td>
                </tr>
                ` : ''}
                ${budget ? `
                <tr style="background:#f8f9fa;">
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Budget Range:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;">₹${budget}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Application Date:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${new Date().toLocaleDateString()}</td>
                </tr>
                <tr style="background:#f8f9fa;">
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Priority Level:</strong></td>
                  <td style="padding:12px;border-bottom:1px solid #e0e0e0;">
                    <span style="color:#d32f2f;font-weight:bold;">${urgency === 'urgent' ? '🔥 URGENT' : urgency === 'asap' ? '⚡ ASAP' : '📅 Standard'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px;"><strong>Status:</strong></td>
                  <td style="padding:12px;"><span style="color:#4caf50;font-weight:bold;">✅ Confirmed & Under Review</span></td>
                </tr>
              </table>
            </div>

            <div style="background:#fff3cd;padding:25px;border-radius:8px;margin:20px 0;text-align:center;">
              <h3 style="color:#d32f2f;margin:0 0 10px;font-size:18px;">⚡ What Happens Next?</h3>
              <p style="margin:10px 0;font-size:16px;font-weight:bold;">Our premium service process ensures you get the best results!</p>
              
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:15px 0;">
                <div style="background:#fff;padding:15px;border-radius:5px;text-align:center;">
                  <strong style="color:#d32f2f;">📞 Step 1: Contact (${urgency === 'urgent' ? '2 Hours' : urgency === 'asap' ? '4 Hours' : '12 Hours'})</strong><br>
                  <small>Expert consultation call to understand your needs</small>
                </div>
                <div style="background:#fff;padding:15px;border-radius:5px;text-align:center;">
                  <strong style="color:#d32f2f;">📋 Step 2: Assessment</strong><br>
                  <small>Site visit & detailed requirement analysis</small>
                </div>
                <div style="background:#fff;padding:15px;border-radius:5px;text-align:center;">
                  <strong style="color:#d32f2f;">💰 Step 3: Quotation</strong><br>
                  <small>Transparent pricing with no hidden costs</small>
                </div>
                <div style="background:#fff;padding:15px;border-radius:5px;text-align:center;">
                  <strong style="color:#d32f2f;">✅ Step 4: Execution</strong><br>
                  <small>Professional service delivery with quality assurance</small>
                </div>
              </div>
            </div>

            <div style="background:#f0f8ff;padding:25px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 20px;text-align:center;font-size:18px;">🏆 Our Complete Property Services Portfolio</h3>
              
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                <div>
                  <h4 style="color:#d32f2f;margin:0 0 10px;font-size:14px;">🏠 Property Management</h4>
                  <ul style="padding-left:15px;margin:5px 0;font-size:13px;">
                    <li>Tenant management & rent collection</li>
                    <li>Property maintenance & repairs</li>
                    <li>Legal compliance & documentation</li>
                    <li>Regular property inspections</li>
                  </ul>
                </div>
                <div>
                  <h4 style="color:#d32f2f;margin:0 0 10px;font-size:14px;">🎨 Renovation & Interior</h4>
                  <ul style="padding-left:15px;margin:5px 0;font-size:13px;">
                    <li>Complete home renovation</li>
                    <li>Interior design & decoration</li>
                    <li>Modular kitchen & wardrobes</li>
                    <li>Bathroom & flooring upgrades</li>
                  </ul>
                </div>
                <div>
                  <h4 style="color:#d32f2f;margin:0 0 10px;font-size:14px;">🧹 Cleaning & Maintenance</h4>
                  <ul style="padding-left:15px;margin:5px 0;font-size:13px;">
                    <li>Deep cleaning & sanitization</li>
                    <li>Regular housekeeping services</li>
                    <li>Post-construction cleaning</li>
                    <li>Carpet & upholstery cleaning</li>
                  </ul>
                </div>
                <div>
                  <h4 style="color:#d32f2f;margin:0 0 10px;font-size:14px;">📜 Legal & Documentation</h4>
                  <ul style="padding-left:15px;margin:5px 0;font-size:13px;">
                    <li>Property registration & transfer</li>
                    <li>Rental agreement drafting</li>
                    <li>NOC & clearance certificates</li>
                    <li>Property title verification</li>
                  </ul>
                </div>
                <div>
                  <h4 style="color:#d32f2f;margin:0 0 10px;font-size:14px;">🚚 Moving & Packers</h4>
                  <ul style="padding-left:15px;margin:5px 0;font-size:13px;">
                    <li>Professional packing & moving</li>
                    <li>Local & intercity relocation</li>
                    <li>Office shifting services</li>
                    <li>Storage & warehousing</li>
                  </ul>
                </div>
                <div>
                  <h4 style="color:#d32f2f;margin:0 0 10px;font-size:14px;">🔧 Technical Services</h4>
                  <ul style="padding-left:15px;margin:5px 0;font-size:13px;">
                    <li>Electrical & plumbing work</li>
                    <li>AC installation & repair</li>
                    <li>Pest control & fumigation</li>
                    <li>Security system installation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 15px;text-align:center;">🌟 Why 50,000+ Customers Choose Home HNI Services?</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                <div style="text-align:center;">
                  <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✅ 100% Verified Professionals</p>
                  <p style="margin:5px 0;color:#4caf50;font-weight:bold;">💰 Competitive & Transparent Pricing</p>
                  <p style="margin:5px 0;color:#4caf50;font-weight:bold;">🛡️ Quality Guarantee & Insurance</p>
                </div>
                <div style="text-align:center;">
                  <p style="margin:5px 0;color:#4caf50;font-weight:bold;">📞 24/7 Customer Support</p>
                  <p style="margin:5px 0;color:#4caf50;font-weight:bold;">⚡ Quick Response & Delivery</p>
                  <p style="margin:5px 0;color:#4caf50;font-weight:bold;">🏆 4.8/5 Customer Rating</p>
                </div>
              </div>
            </div>

            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/dashboard/services" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">📊 Track My Application</a>
              <a href="https://homehni.com/services/emergency" style="background:#ff9800;color:#fff;text-decoration:none;padding:16px 28px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">🚨 Emergency Services</a>
            </p>

            <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📞 Your Dedicated Service Team:</h4>
              <p style="margin:5px 0;">📱 <strong>WhatsApp Support:</strong> +91-9876543210 (Instant response)</p>
              <p style="margin:5px 0;">📧 <strong>Service Email:</strong> services@homehni.com</p>
              <p style="margin:5px 0;">⏰ <strong>Service Hours:</strong> 8 AM - 8 PM (Mon-Sun)</p>
              <p style="margin:5px 0;">🆘 <strong>Emergency Line:</strong> +91-9876543211 (24/7)</p>
              <p style="margin:10px 0;"><strong>Preferred Contact:</strong> ${contactPreference || 'Phone & WhatsApp'}</p>
            </div>

            ${applicationDetails ? `
            <div style="background:#fff3cd;padding:15px;border-radius:5px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📝 Your Special Requirements:</h4>
              <p style="margin:5px 0;font-style:italic;">"${applicationDetails}"</p>
              <p style="margin:10px 0 5px;font-size:14px;color:#666;">Our team will address these specific requirements during the consultation call.</p>
            </div>
            ` : ''}

            <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">🎁 Special Welcome Offer!</h4>
              <p style="margin:5px 0;"><strong>As a new Home HNI Services customer, you get:</strong></p>
              <p style="margin:5px 0;color:#d32f2f;font-weight:bold;">✓ FREE consultation & site visit (₹500 value)</p>
              <p style="margin:5px 0;color:#d32f2f;font-weight:bold;">✓ 10% OFF on first service booking</p>
              <p style="margin:5px 0;color:#d32f2f;font-weight:bold;">✓ Priority scheduling for future services</p>
              <p style="margin:10px 0;font-size:14px;"><strong>Valid for 7 days from application date</strong></p>
            </div>

            <p>Get ready to experience the Home HNI difference - where premium service meets unmatched reliability. Our expert team is already preparing to exceed your expectations!</p>
            <p>Looking forward to serving you,<br><strong>Home HNI Premium Services Team</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Services Network</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🎯 Welcome to Home HNI Premium Services!

Dear ${userName || 'Valued Customer'},

🎉 Excellent choice! Your application for ${serviceType || 'Premium Property Services'} has been successfully received.

📋 Your Service Application Summary:
Service Requested: ${serviceType || 'Premium Property Service'}
${serviceCategory ? `Category: ${serviceCategory}` : ''}
${propertyType ? `Property Type: ${propertyType}` : ''}
${locality ? `Location: ${locality}` : ''}
${budget ? `Budget Range: ₹${budget}` : ''}
Application Date: ${new Date().toLocaleDateString()}
Priority Level: ${urgency === 'urgent' ? '🔥 URGENT' : urgency === 'asap' ? '⚡ ASAP' : '📅 Standard'}
Status: ✅ Confirmed & Under Review

⚡ What Happens Next?
📞 Step 1: Contact (${urgency === 'urgent' ? '2 Hours' : urgency === 'asap' ? '4 Hours' : '12 Hours'}) - Expert consultation call
📋 Step 2: Assessment - Site visit & detailed analysis  
💰 Step 3: Quotation - Transparent pricing, no hidden costs
✅ Step 4: Execution - Professional service with quality assurance

🏆 Our Complete Services:
🏠 Property Management (tenant management, maintenance, legal compliance)
🎨 Renovation & Interior (complete renovation, interior design, modular solutions)
🧹 Cleaning & Maintenance (deep cleaning, housekeeping, post-construction)
📜 Legal & Documentation (registration, agreements, NOCs, verification)
🚚 Moving & Packers (professional packing, local/intercity relocation)
🔧 Technical Services (electrical, plumbing, AC, security systems)

🌟 Why 50,000+ Customers Choose Us:
✅ 100% Verified Professionals
💰 Competitive & Transparent Pricing  
🛡️ Quality Guarantee & Insurance
📞 24/7 Customer Support
⚡ Quick Response & Delivery
🏆 4.8/5 Customer Rating

Your Dedicated Service Team:
📱 WhatsApp: +91-9876543210 (Instant response)
📧 Email: services@homehni.com
⏰ Hours: 8 AM - 8 PM (Mon-Sun)  
🆘 Emergency: +91-9876543211 (24/7)

${applicationDetails ? `📝 Your Special Requirements: "${applicationDetails}"` : ''}

🎁 Special Welcome Offer (7 days):
✓ FREE consultation & site visit (₹500 value)
✓ 10% OFF on first service booking
✓ Priority scheduling for future services

Track Application: https://homehni.com/dashboard/services
Emergency Services: https://homehni.com/services/emergency

Get ready to experience the Home HNI difference!

Home HNI Premium Services Team
© 2025 Home HNI - Premium Property Services Network`;

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
