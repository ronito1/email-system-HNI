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


// 2. Property live email
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
                <tr><td style="padding:8px 0;"><strong>💰 Rent/Sale Price:</strong> ${price || 'N/A'}</td></tr>
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

            
            <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:25px 0;">
              <h3 style="margin:0 0 15px;color:#2e7d32;font-size:18px;">🎯 Want Even Faster Results?</h3>
              <p style="margin:0;">Upgrade to our <strong>Premium Plans</strong> for guaranteed Buyer/Tenant matching, personal field assistant, and more!</p>
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
app.post("/send-price-suggestions-email", async (req, res) => {
  const { to, userName, locality, rangeMin, rangeMax, yourPrice, updatePriceUrl, propertyType = 'residential', listingType = 'sell', userType = 'seller' } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "💰 Market Insights & Premium Plans for " + (locality || 'Your Area');
  
  // Define pricing plans based on property type, listing type, and user type
  const pricingPlans = {
    // SELLER PLANS
    seller: {
      residential: [
        { name: "Silver Plan", price: "₹999", duration: "Basic promotion", features: ["Basic listing visibility", "Standard support", "Email assistance"], url: "/plans?tab=seller" },
        { name: "Gold Plan", price: "₹9,999", duration: "Social boost", features: ["Featured listing", "Social media promotion", "Priority support", "Enhanced visibility"], url: "/plans?tab=seller" },
        { name: "Platinum Plan", price: "₹14,999", duration: "Expert guidance", features: ["Top listing placement", "Expert property guidance", "Premium support", "Advanced analytics"], url: "/plans?tab=seller" },
        { name: "Diamond Plan", price: "₹20,000", duration: "Personal field assistant", features: ["Personal field assistant", "Maximum visibility", "Dedicated support", "Priority processing"], url: "/plans?tab=seller" }
      ],
      commercial: [
        { name: "Business Silver", price: "₹999", duration: "Commercial marketing", features: ["Basic commercial listing", "Business visibility", "Email support"], url: "/plans?tab=seller" },
        { name: "Business Gold", price: "₹18,999", duration: "Premium business boost", features: ["Featured commercial listing", "Premium marketing", "Business networks", "Priority support"], url: "/plans?tab=seller" },
        { name: "Business Platinum", price: "₹25,999", duration: "Business expert", features: ["Top commercial placement", "Business expert assistance", "Maximum exposure", "Dedicated account manager"], url: "/plans?tab=seller" }
      ],
      industrial: [
        { name: "Industrial Basic", price: "₹999", duration: "Industrial promotion", features: ["Industrial listing", "Sector visibility", "Technical support"], url: "/plans?tab=seller" },
        { name: "Industrial Pro", price: "₹28,999", duration: "Industrial expert", features: ["Featured industrial listing", "Expert consultation", "Industry networks", "Priority placement"], url: "/plans?tab=seller" },
        { name: "Industrial Elite", price: "₹35,999", duration: "Premium industrial", features: ["Premium industrial listing", "Maximum exposure", "Dedicated specialist", "Custom solutions"], url: "/plans?tab=seller" }
      ],
      agricultural: [
        { name: "Agricultural Basic", price: "₹999", duration: "Farm promotion", features: ["Agricultural listing", "Rural visibility", "Farmer support"], url: "/plans?tab=seller" },
        { name: "Agricultural Pro", price: "₹18,999", duration: "Farm expert", features: ["Featured farm listing", "Agricultural networks", "Expert advice", "Market insights"], url: "/plans?tab=seller" },
        { name: "Agricultural Elite", price: "₹25,999", duration: "Premium agricultural", features: ["Premium farm listing", "Maximum rural reach", "Agricultural expert", "Custom marketing"], url: "/plans?tab=seller" }
      ]
    },
    
    // BUYER PLANS
    buyer: {
      residential: [
        { name: "Silver Plan", price: "₹999", duration: "Basic search", features: ["Basic property search", "Email alerts", "Standard support"], url: "/plans?tab=buyer" },
        { name: "Gold Plan", price: "₹2,499", duration: "Expert assistance", features: ["Expert property assistance", "Priority viewing", "Dedicated support", "Market insights"], url: "/plans?tab=buyer" },
        { name: "Platinum Plan", price: "₹4,999", duration: "Exclusive support", features: ["Exclusive property access", "Personal property consultant", "Premium support", "Custom search"], url: "/plans?tab=buyer" }
      ],
      commercial: [
        { name: "Business Explorer", price: "₹999", duration: "Commercial search", features: ["Commercial property search", "Business alerts", "Email support"], url: "/plans?tab=buyer" },
        { name: "Business Pro", price: "₹8,999", duration: "Commercial expert", features: ["Expert commercial assistance", "Priority access", "Business consultation", "Market analysis"], url: "/plans?tab=buyer" },
        { name: "Business Elite", price: "₹12,999", duration: "VIP commercial", features: ["VIP commercial access", "Dedicated business consultant", "Premium networking", "Custom solutions"], url: "/plans?tab=buyer" }
      ],
      industrial: [
        { name: "Industrial Basic", price: "₹999", duration: "Industrial search", features: ["Industrial property search", "Technical alerts", "Industry support"], url: "/plans?tab=buyer" },
        { name: "Industrial Pro", price: "₹15,999", duration: "Industrial expert", features: ["Expert industrial assistance", "Technical consultation", "Industry networks", "Site analysis"], url: "/plans?tab=buyer" },
        { name: "Industrial Elite", price: "₹22,999", duration: "VIP industrial", features: ["VIP industrial access", "Dedicated industrial expert", "Custom requirements", "Priority processing"], url: "/plans?tab=buyer" }
      ]
    },
    
    // OWNER PLANS (for rental properties)
    owner: {
      residential: [
        { name: "Silver", price: "₹100", duration: "On call assistance", features: ["Basic rental assistance", "Phone support", "Tenant matching"], url: "/plans?tab=owner" },
        { name: "Gold", price: "₹5,899", duration: "House visit assistance", features: ["Property visit coordination", "Tenant screening", "Documentation help", "Expert guidance"], url: "/plans?tab=owner" },
        { name: "Platinum", price: "₹6,999", duration: "Expert guidance", features: ["Expert rental guidance", "Premium tenant matching", "Legal assistance", "Priority support"], url: "/plans?tab=owner" },
        { name: "Diamond", price: "₹10,999", duration: "Personal field assistant", features: ["Personal field assistant", "Complete property management", "Dedicated support", "Premium services"], url: "/plans?tab=owner" }
      ],
      commercial: [
        { name: "Business Basic", price: "₹999", duration: "Commercial support", features: ["Basic commercial rental", "Business tenant matching", "Email support"], url: "/plans?tab=commercial-owner" },
        { name: "Business Pro", price: "₹15,999", duration: "Premium marketing", features: ["Premium commercial marketing", "Quality tenant screening", "Business consultation", "Priority placement"], url: "/plans?tab=commercial-owner" },
        { name: "Business Elite", price: "₹25,999", duration: "Dedicated manager", features: ["Dedicated account manager", "Complete rental management", "Premium services", "Custom solutions"], url: "/plans?tab=commercial-owner" }
      ]
    },
    
    // TENANT PLANS
    tenant: {
      residential: [
        { name: "Basic", price: "₹99", duration: "Search assistance", features: ["Basic property search", "Rental alerts", "Email support"], url: "/plans?tab=rental" },
        { name: "Standard", price: "₹499", duration: "Visit coordination", features: ["Property visit coordination", "Shortlisting assistance", "Documentation help", "Phone support"], url: "/plans?tab=rental" },
        { name: "Premium", price: "₹999", duration: "Expert assistance", features: ["Expert rental assistance", "Premium property access", "Negotiation support", "Dedicated consultant"], url: "/plans?tab=rental" }
      ],
      commercial: [
        { name: "Business Basic", price: "₹1,499", duration: "Commercial search", features: ["Commercial property search", "Business space alerts", "Email support"], url: "/plans?tab=rental" },
        { name: "Business Standard", price: "₹2,499", duration: "Office coordination", features: ["Office visit coordination", "Business consultation", "Documentation help", "Priority support"], url: "/plans?tab=rental" },
        { name: "Business Premium", price: "₹3,999", duration: "Corporate assistance", features: ["Corporate rental assistance", "Premium office access", "Business expert", "Dedicated manager"], url: "/plans?tab=rental" }
      ]
    },
    
    // BUILDER PLANS (for developers/land plots)
    builder: {
      residential: [
        { name: "Lifetime Standard", price: "₹1,49,999", duration: "Lifetime project showcase", features: ["Project showcase platform", "Builder profile", "Basic marketing", "Email support"], url: "/plans?tab=builder-lifetime" },
        { name: "Lifetime Platinum", price: "₹2,49,999", duration: "Enhanced marketing", features: ["Enhanced project marketing", "Featured placement", "Social media promotion", "Priority support"], url: "/plans?tab=builder-lifetime" },
        { name: "Lifetime VIP", price: "₹3,99,999", duration: "Premium showcase", features: ["Premium project showcase", "Maximum visibility", "Dedicated manager", "Custom marketing"], url: "/plans?tab=builder-lifetime" }
      ],
      commercial: [
        { name: "Commercial Standard", price: "₹2,49,999", duration: "Commercial projects", features: ["Commercial project showcase", "Business networks", "Industry marketing", "Business support"], url: "/plans?tab=builder-lifetime" },
        { name: "Commercial Platinum", price: "₹3,49,999", duration: "Business growth", features: ["Enhanced commercial marketing", "Premium business networks", "Growth consultation", "Priority placement"], url: "/plans?tab=builder-lifetime" },
        { name: "Commercial VIP", price: "₹4,99,999", duration: "Enterprise level", features: ["Enterprise-level showcase", "Maximum business exposure", "Dedicated account manager", "Custom solutions"], url: "/plans?tab=builder-lifetime" }
      ]
    },
    
    // AGENT PLANS
    agent: {
      basic: [
        { name: "Basic Monthly", price: "₹999/month", duration: "Getting started", features: ["Up to 10 listings", "Basic marketing", "Email support", "Property alerts"], url: "/plans?tab=agent" },
        { name: "Basic Quarterly", price: "₹7,999/quarter", duration: "Popular choice", features: ["Up to 50 listings", "Enhanced marketing", "Phone support", "Analytics dashboard"], url: "/plans?tab=agent" },
        { name: "Basic Yearly", price: "₹24,999/year", duration: "Best value", features: ["Up to 200 listings", "Premium marketing", "Priority support", "Lead generation tools"], url: "/plans?tab=agent" }
      ],
      lifetime: [
        { name: "Lifetime Standard", price: "₹79,999", duration: "For new agents", features: ["Unlimited listings", "Agent profile", "Basic marketing tools", "Standard support"], url: "/plans?tab=agent" },
        { name: "Lifetime Platinum", price: "₹1,49,999", duration: "Enhanced visibility", features: ["Premium agent profile", "Enhanced marketing", "Priority placement", "Advanced tools"], url: "/plans?tab=agent" },
        { name: "Lifetime VIP", price: "₹2,49,999", duration: "Exclusive services", features: ["VIP agent status", "Maximum visibility", "Exclusive services", "Dedicated support"], url: "/plans?tab=agent" }
      ]
    }
  };

  // Determine the correct plan category based on user type, property type, and listing type
  let currentPlans = [];
  let planCategory = 'seller'; // default
  let propertyCategory = propertyType || 'residential';

  // Map user intentions to plan categories
  if (userType === 'buyer' || userType === 'purchase') {
    planCategory = 'buyer';
    currentPlans = pricingPlans.buyer[propertyCategory] || pricingPlans.buyer.residential;
  } else if (userType === 'tenant' || listingType === 'rent') {
    if (userType === 'owner' || userType === 'landlord') {
      planCategory = 'owner';
      currentPlans = pricingPlans.owner[propertyCategory] || pricingPlans.owner.residential;
    } else {
      planCategory = 'tenant';
      currentPlans = pricingPlans.tenant[propertyCategory] || pricingPlans.tenant.residential;
    }
  } else if (userType === 'builder' || propertyType === 'land' || propertyType === 'plot') {
    planCategory = 'builder';
    currentPlans = pricingPlans.builder[propertyCategory] || pricingPlans.builder.residential;
  } else if (userType === 'agent') {
    planCategory = 'agent';
    currentPlans = pricingPlans.agent.basic; // default to basic plans
  } else {
    // Default to seller plans
    planCategory = 'seller';
    currentPlans = pricingPlans.seller[propertyCategory] || pricingPlans.seller.residential;
  }

  const plansHtml = currentPlans.map(plan => `
    <div style="border: 2px solid #e0e0e0; border-radius: 12px; padding: 20px; margin: 15px 0; text-align: center; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <h3 style="color: #d32f2f; margin: 0 0 10px; font-size: 20px; font-weight: bold;">${plan.name}</h3>
      <div style="font-size: 28px; font-weight: bold; color: #333; margin: 10px 0;">${plan.price}</div>
      <div style="color: #666; margin-bottom: 15px; font-style: italic;">${plan.duration}</div>
      <ul style="list-style: none; padding: 0; margin: 15px 0; text-align: left;">
        ${plan.features.map(feature => `<li style="padding: 5px 0; color: #555; font-size: 14px;">✓ ${feature}</li>`).join('')}
      </ul>
      <a href="https://homehni.com${plan.url}" style="background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 15px; box-shadow: 0 3px 6px rgba(211,47,47,0.3); transition: all 0.3s ease;">Choose ${plan.name}</a>
    </div>
  `).join('');
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Market Insights & Premium Plans</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);padding:25px;"><img src="https://homehni.com/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI" style="filter: brightness(0) invert(1);"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 20px;color:#d32f2f;font-size:26px;text-align:center;">💰 Market Insights for ${locality || 'Your Area'}</h2>
            <p style="font-size:18px;">Hello <strong>${userName || 'there'}</strong>,</p>
            <p>Great news! We've analyzed recent market trends in <strong>${locality || 'your area'}</strong> and have personalized recommendations for your <strong>${propertyType || 'residential'} ${listingType || 'sale'}</strong> property.</p>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #d32f2f;">
              <h3 style="margin: 0 0 15px; color: #d32f2f; font-size: 20px;">📊 Market Analysis</h3>
              <p style="margin: 8px 0; font-size: 16px;">Properties in your area recently closed between <strong style="color:#2e7d32;">₹${rangeMin || 'N/A'} – ₹${rangeMax || 'N/A'}</strong></p>
              <p style="margin: 8px 0; font-size: 16px;">Your current listing price: <strong style="color:#d32f2f;">₹${yourPrice || 'N/A'}</strong></p>
            </div>

            <h3 style="color: #d32f2f; margin: 35px 0 25px; text-align: center; font-size: 22px;">🚀 Boost Your Property's Success Rate</h3>
            <p style="text-align: center; font-size: 17px; margin-bottom: 30px;">Upgrade to our premium plans designed specifically for <strong>${planCategory}s</strong> and achieve <strong>3X faster results</strong>:</p>
            
            ${plansHtml}
            
            <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <h4 style="margin: 0 0 15px; color: #2e7d32; font-size: 20px;">🎯 Why Choose Home HNI Premium?</h4>
              <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 20px;">
                <p style="margin: 5px; background: white; padding: 10px 15px; border-radius: 20px; display: inline-block; font-size: 14px;">✓ Premium listings get <strong>5X more views</strong></p>
                <p style="margin: 5px; background: white; padding: 10px 15px; border-radius: 20px; display: inline-block; font-size: 14px;">✓ Featured properties close <strong>3X faster</strong></p>
                <p style="margin: 5px; background: white; padding: 10px 15px; border-radius: 20px; display: inline-block; font-size: 14px;">✓ Dedicated expert support</p>
                <p style="margin: 5px; background: white; padding: 10px 15px; border-radius: 20px; display: inline-block; font-size: 14px;">✓ Advanced analytics & insights</p>
              </div>
            </div>

            <p style="text-align:center;margin:35px 0;">
              <a href="https://homehni.com/plans?tab=${planCategory}" style="background:linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);color:#fff;text-decoration:none;padding:18px 36px;border-radius:10px;font-weight:bold;font-size:18px;display:inline-block;box-shadow: 0 4px 12px rgba(211,47,47,0.4);">🎯 View All ${planCategory.charAt(0).toUpperCase() + planCategory.slice(1)} Plans</a>
            </p>
            
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404;"><strong>Need help choosing the right plan?</strong></p>
              <p style="margin: 5px 0 0; color: #856404;">Our property experts are here to provide personalized recommendations!</p>
              <p style="margin: 10px 0 0;"><a href="https://homehni.com/contact-us" style="color: #d32f2f; font-weight: bold;">Contact Our Experts →</a></p>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px;">Best regards,<br><strong>Team Home HNI</strong><br><em>Your Premium Property Partner</em></p>
            
            <div style="margin-top: 25px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #666;">Follow us for more property insights:</p>
              <p style="margin: 10px 0 0; font-size: 12px; color: #888;">
                <a href="#" style="color: #d32f2f; text-decoration: none;">Website</a> • 
                <a href="#" style="color: #d32f2f; text-decoration: none;">Facebook</a> • 
                <a href="#" style="color: #d32f2f; text-decoration: none;">LinkedIn</a> • 
                <a href="#" style="color: #d32f2f; text-decoration: none;">Twitter</a>
              </p>
            </div>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:20px;font-size:13px;color:#777;">
          <p style="margin:0;">&copy; 2025 Home HNI - Premium Property Solutions | All Rights Reserved</p>
          <p style="margin:5px 0 0;"><a href="https://homehni.com/privacy-policy" style="color:#d32f2f;">Privacy Policy</a> • <a href="https://homehni.com/terms-and-conditions" style="color:#d32f2f;">Terms of Service</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Market Insights & Premium Plans for ${locality || 'Your Area'}

Hello ${userName || 'there'},

Great news! We've analyzed recent market trends in ${locality || 'your area'} and have personalized recommendations for your ${propertyType || 'residential'} ${listingType || 'sale'} property.

MARKET ANALYSIS:
Properties in your area recently closed between ₹${rangeMin || 'N/A'} – ₹${rangeMax || 'N/A'}
Your current listing price: ₹${yourPrice || 'N/A'}

BOOST YOUR PROPERTY'S SUCCESS RATE:
Upgrade to our premium plans designed specifically for ${planCategory}s and achieve 3X faster results:

${currentPlans.map(plan => `
${plan.name} - ${plan.price} (${plan.duration})
${plan.features.map(feature => `• ${feature}`).join('\n')}
Choose this plan: https://homehni.com${plan.url}
`).join('\n')}

WHY CHOOSE HOME HNI PREMIUM?
✓ Premium listings get 5X more views
✓ Featured properties close 3X faster  
✓ Dedicated expert support
✓ Advanced analytics & insights

View all ${planCategory} plans: https://homehni.com/plans?tab=${planCategory}

Need help choosing the right plan? Contact our property experts: https://homehni.com/contact-us

Best regards,
Team Home HNI
Your Premium Property Partner

© 2025 Home HNI - Premium Property Solutions | All Rights Reserved
Privacy Policy: https://homehni.com/privacy-policy
Terms of Service: https://homehni.com/terms-and-conditions`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 4. Loan confirmation email
app.post("/send-loan-enquiry-email", async (req, res) => {
  console.log("Received body:", req.body); // Debug: log incoming request

  const { to, email, userEmail, userName, loanEligibilityUrl } = req.body;
  const resolvedTo = (to || email || userEmail || "").trim();
  const isValidEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(resolvedTo) && !/@example\.com$/i.test(resolvedTo);
  if (!isValidEmail) return res.status(400).json({ status: "error", error: "Invalid recipient email", resolvedTo });

  const subject = `🏦 Loan Application Received - Explore All Loan Services at Home HNI`;

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
            <p>Thank you for choosing <strong>Home HNI</strong>. We've successfully received your application and our premium loan specialists will contact you within <strong>12 hours</strong>.</p>
            
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
              <a href="${loanEligibilityUrl || 'https://homehni.in/services?tab=loans'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:18px;display:inline-block;">📊 Explore All Loan Services</a>
            </p>

            <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h4 style="margin: 0 0 10px; color: #f57c00;">🚀 Need Property Services Too?</h4>
              <p style="margin: 10px 0;">Upgrade to our <strong>Premium Property Plans</strong> for complete real estate solutions:</p>
              <p style="margin: 5px 0;">• Property search and verification services</p>
              <p style="margin: 5px 0;">• Legal documentation and registration support</p>
              <p style="margin: 5px 0;">• Property valuation and market insights</p>
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

Thank you for choosing Home HNI. We've successfully received your application and our premium loan specialists will contact you within 4 hours.

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

Explore all loan services: ${loanEligibilityUrl || 'https://homehni.in/services?tab=loans'}

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


// 6. Plan upgrade suggestion email - Updated with price suggestions content
app.post("/send-plan-upgrade-email", async (req, res) => {
  const { to, userName, locality, rangeMin, rangeMax, yourPrice, updatePriceUrl, propertyType = 'residential', listingType = 'sell', userType = 'seller' } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "� Market Insights & Premium Plans for " + (locality || 'Your Area');
  
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

            <h3 style="color: #d32f2f; margin: 30px 0 20px; text-align: center;">💎Upgrade Your Plan</h3>
            
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
              <p style="margin: 8px 0;">✓ <strong>Free Property Photography</strong></p>
              <p style="margin: 8px 0;">✓ <strong>Dedicated Account Manager</strong> for personalized support</p>
              <p style="margin: 8px 0;">✓ <strong>Legal Document Assistance</strong> for smooth transactions</p>
            </div>

           

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

Upgrade now: ${upgradePlanUrl || 'https://homehni.com/plans'}

Questions? Call us at +91 8074 017 388

Team Home HNI
Your Success Partners

© 2025 Home HNI - Accelerating Property Success`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});


// // 7. Deal closed email - CLEANED VERSION
// app.post("/send-deal-closed-email", async (req, res) => {
//   const { to, userName, locality, dealType, postDealServicesUrl, propertyValue } = req.body;
//   if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

//   const subject = "🎉 Congratulations! Your Property Deal is Successfully Closed with Home HNI";
  
//   const html = `<!DOCTYPE html>
// <html>
// <head><meta charset="UTF-8"><title>Congratulations! Deal Successfully Closed</title></head>
// <body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
//   <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
//     <tr><td align="center">
//       <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
//         <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
//         <tr>
//           <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
//             <div style="text-align: center; margin-bottom: 30px;">
//               <h2 style="margin:0 0 10px;color:#d32f2f;font-size:28px;">🎉 Congratulations!</h2>
//               <h3 style="margin:0 0 20px;color:#4caf50;font-size:20px;">Your Property Deal is Successfully Closed</h3>
//             </div>
            
//             <p>Dear ${userName || 'Valued Customer'},</p>
//             <p>🏆 <strong>Fantastic news!</strong> Your property in <strong>${locality || 'your area'}</strong> has been successfully <strong>${dealType || 'sold/rented'}</strong> through Home HNI's platform.</p>
            
//             ${propertyValue ? `
//             <div style="background: linear-gradient(135deg, #e8f5e8, #f1f8e9); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border-left: 4px solid #4caf50;">
//               <h4 style="margin: 0 0 10px; color: #2e7d32;">💰 Deal Summary</h4>
//               <p style="margin: 5px 0; font-size: 18px;"><strong>Property Value: ₹${propertyValue}</strong></p>
//               <p style="margin: 5px 0; color: #666;">Transaction completed through Home HNI</p>
//             </div>
//             ` : ''}

//             <div style="background:#e3f2fd;padding:20px;border-radius:8px;margin:20px 0;">
//               <h4 style="color:#d32f2f;margin:0 0 15px;">📞 Need Support?</h4>
//               <p style="margin:5px 0;">📱 Contact us: +91 8074 017 388</p>
//               <p style="margin:5px 0;">📧 Email: homehni@gmail.com</p>
//               <p style="margin:5px 0;">⏰ Available: Monday - Saturday, 9 AM - 7 PM</p>
//             </div>

//             <p style="text-align:center;margin:28px 0;">
//               <a href="${postDealServicesUrl || 'https://homehni.com/dashboard'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 25px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">📋 View Dashboard</a>
//             </p>
            
//             <p>Once again, congratulations on your successful property transaction! We're thrilled to have been part of your journey.</p>
//             <p><strong>Best regards,</strong><br><strong>Home HNI Team</strong></p>
//           </td>
//         </tr>
//         <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
//         <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Your Trusted Property Platform</td></tr>
//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;

//   const text = `🎉 Congratulations! Your Property Deal is Successfully Closed

// Dear ${userName || 'Valued Customer'},

// 🏆 Fantastic news! Your property in ${locality || 'your area'} has been successfully ${dealType || 'sold/rented'} through Home HNI's platform.

// ${propertyValue ? `💰 Deal Summary: Property Value: ₹${propertyValue}` : ''}

// Need Support?
// 📱 Contact us: +91 8074 017 388
// 📧 Email: homehni@gmail.com
// ⏰ Available: Monday - Saturday, 9 AM - 7 PM

// Dashboard: ${postDealServicesUrl || 'https://homehni.com/dashboard'}

// Once again, congratulations on your successful property transaction! We're thrilled to have been part of your journey.

// Best regards,
// Home HNI Team

// © 2025 Home HNI - Your Trusted Property Platform`;

//   const result = await sendEmail({ to, subject, html, text });
//   res.json(result);
// }); 



// Help Request Email Template - "I'm interested / Let us help you"
app.post("/send-help-request-email", async (req, res) => {
  const { to, email, userEmail, userName, propertyType, phone, adminEmail, customerPhone } = req.body;
  const resolvedTo = (to || email || userEmail || "").trim();
  if (!resolvedTo) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🚀 Home HNI Assistance Request - We'll Help You!";
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Property Listing Assistance</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🚀 Thank You for Choosing Home HNI Assistance!</h2>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for requesting assistance with your ${propertyType || 'property'} listing. Our expert team will handle everything for you!</p>
            
            <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">📋 What Happens Next:</h3>
              <ul style="padding-left:20px;margin:10px 0;">
                <li>📞 <strong>Our agent will call you within 2 hours</strong></li>
                <li>📝 <strong>We'll gather all property details over the phone</strong></li>
                <li>📸 <strong>Schedule professional photography (if needed)</strong></li>
                <li>✅ <strong>Your property will be live within 24 hours</strong></li>
              </ul>
            </div>

            <div style="background:#e3f2fd;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 15px;">📞 Need Immediate Support?</h4>
              <p style="margin:5px 0;">📱 Contact us: +91 8074 017 388</p>
              <p style="margin:5px 0;">📧 Email: homehni@gmail.com</p>
              <p style="margin:5px 0;">⏰ Available: Monday - Saturday, 9 AM - 7 PM</p>
            </div>

            <p style="text-align:center;margin:28px 0;">
              <a href="https://homehni.com/dashboard" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 25px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">📊 View Dashboard</a>
            </p>

            <p>We're excited to help you achieve a successful property listing with Home HNI!</p>
            <p>Best regards,<br><strong>Home HNI Team</strong></p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
        <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Your Trusted Property Platform</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🚀 Thank You for Choosing Home HNI Assistance!

Hi ${userName || 'there'},

Thank you for requesting assistance with your ${propertyType || 'property'} listing. Our expert team will handle everything for you!

What Happens Next:
• 📞 Our agent will call you within 2 hours
• 📝 We'll gather all property details over the phone
• 📸 Schedule professional photography (if needed)
• ✅ Your property will be live within 24 hours

Need Immediate Support?
📱 Contact us: +91 8074 017 388
📧 Email: homehni@gmail.com
⏰ Available: Monday - Saturday, 9 AM - 7 PM

Dashboard: https://homehni.com/dashboard

We're excited to help you achieve a successful property listing with Home HNI!

Best regards,
Home HNI Team

© 2025 Home HNI - Your Trusted Property Platform`;

  const result = await sendEmail({ to: resolvedTo, subject, html, text });
  res.json(result);

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
            </div>
            ` : ''}


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

Connect with Our Experts:
📱 WhatsApp: +91-9876543210
📧 Email: painting@homehni.com
⏰ Available: 8 AM - 8 PM (Mon-Sun)


Transform your property into a premium showcase!

Home HNI Painting Services Team
© 2025 Home HNI - Premium Property Services`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result); 
});

// // 10. Property submitted email (Submit property trigger)
// app.post("/send-property-submitted-email", async (req, res) => {
//   const { to, userName, propertyType, locality, propertyValue, pricingPlanUrl } = req.body;
//   if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

//   const subject = "🎉 Welcome to Home HNI Premium! Your Property is Under Review";
  
//   const html = `<!DOCTYPE html>
// <html>
// <head><meta charset="UTF-8"><title>Welcome to Home HNI Premium</title></head>
// <body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
//   <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
//     <tr><td align="center">
//       <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
//         <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
//         <tr>
//           <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
//             <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🎉 Welcome to Home HNI Premium Property Services!</h2>
//             <p>Hi ${userName || 'there'},</p>
//             <p>Congratulations! You've successfully submitted your <strong>${propertyType || 'premium property'}</strong> to India's most trusted property platform. Your property is now in our expert review queue.</p>

//             ${locality || propertyValue ? `
//             <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
//               <h3 style="color:#d32f2f;margin:0 0 10px;font-size:16px;">📋 Your Property Summary:</h3>
//               <p style="margin:5px 0;"><strong>Property Type:</strong> ${propertyType || 'Premium Property'}</p>
//               ${locality ? `<p style="margin:5px 0;"><strong>Location:</strong> ${locality}</p>` : ''}
//               ${propertyValue ? `<p style="margin:5px 0;"><strong>Value:</strong> ₹${propertyValue}</p>` : ''}
//               <p style="margin:5px 0;"><strong>Status:</strong> <span style="color:#ff9800;">Under Premium Review</span></p>
//             </div>
//             ` : ''}

//             <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;">
//               <h3 style="color:#d32f2f;margin:0 0 15px;font-size:18px;">⚡ What Happens Next? (Premium Process)</h3>
//               <ul style="padding-left:20px;margin:10px 0;">
//                 <li>🔍 <strong>Expert Review (6-8 hours):</strong> Our property specialists verify all details</li>
//                 <li>📸 <strong>Photo Enhancement:</strong> Professional touch-ups for maximum appeal</li>
//                 <li>🎯 <strong>Market Analysis:</strong> Optimal pricing & positioning recommendations</li>
//                 <li>✅ <strong>Premium Go-Live:</strong> Featured placement across all channels</li>
//                 <li>📱 <strong>Instant Notifications:</strong> Real-time updates on interest & inquiries</li>
//               </ul>
//             </div>

//             <div style="background:#f0f8ff;padding:25px;border-radius:8px;margin:20px 0;text-align:center;">
//               <h3 style="color:#d32f2f;margin:0 0 15px;font-size:18px;">🚀 Boost Your Property's Performance!</h3>
//               <p style="margin:10px 0;">Upgrade now and get <strong>3X more visibility</strong> + <strong>50% faster deals</strong></p>
              
//               <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;margin:20px 0;">
//                 <div style="background:#fff;padding:15px;border-radius:8px;border:2px solid #e0e0e0;">
//                   <h4 style="color:#4caf50;margin:0 0 8px;font-size:14px;">FREE</h4>
//                   <p style="margin:0;font-size:12px;font-weight:bold;">Basic Listing</p>
//                   <p style="margin:5px 0;font-size:11px;">Standard visibility</p>
//                   <p style="margin:5px 0;font-size:11px;">30-day listing</p>
//                 </div>
//                 <div style="background:#fff;padding:15px;border-radius:8px;border:2px solid #ff9800;position:relative;">
//                   <div style="background:#ff9800;color:#fff;padding:3px 8px;border-radius:3px;font-size:10px;position:absolute;top:-8px;left:50%;transform:translateX(-50%);">POPULAR</div>
//                   <h4 style="color:#ff9800;margin:0 0 8px;font-size:14px;">₹${propertyType === 'Commercial' ? '1499' : propertyType === 'Industrial' ? '1999' : '999'}</h4>
//                   <p style="margin:0;font-size:12px;font-weight:bold;">Premium Plan</p>
//                   <p style="margin:5px 0;font-size:11px;">5X more visibility</p>
//                   <p style="margin:5px 0;font-size:11px;">Verified contacts</p>
//                   <p style="margin:5px 0;font-size:11px;">Priority support</p>
//                 </div>
//                 <div style="background:#fff;padding:15px;border-radius:8px;border:2px solid #d32f2f;">
//                   <h4 style="color:#d32f2f;margin:0 0 8px;font-size:14px;">₹${propertyType === 'Commercial' ? '2499' : propertyType === 'Industrial' ? '2999' : '1999'}</h4>
//                   <p style="margin:0;font-size:12px;font-weight:bold;">Elite Plan</p>
//                   <p style="margin:5px 0;font-size:11px;">Featured listings</p>
//                   <p style="margin:5px 0;font-size:11px;">Dedicated advisor</p>
//                   <p style="margin:5px 0;font-size:11px;">Legal support</p>
//                 </div>
//               </div>
//             </div>

//             <p style="text-align:center;margin:28px 0;">
//               <a href="${pricingPlanUrl || 'https://homehni.com/plans?tab=seller'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">🚀 Upgrade Now</a>
//               <a href="https://homehni.com/dashboard" style="background:#4caf50;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">📊 Track Status</a>
//             </p>

//             <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
//               <h4 style="color:#d32f2f;margin:0 0 10px;">🎁 Limited Time: First-Time Listing Bonus!</h4>
//               <p style="margin:5px 0;color:#d32f2f;font-weight:bold;">Upgrade within 24 hours and get 20% OFF + FREE property photography!</p>
//               <p style="margin:5px 0;font-size:14px;">Code: WELCOME20 (Auto-applied)</p>
//             </div>

//             <p>Get ready to experience the Home HNI advantage - where premium properties meet premium service!</p>
//             <p>Best regards,<br><strong>Home HNI Premium Review Team</strong></p>
//           </td>
//         </tr>
//         <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
//         <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Platform</td></tr>
//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;

//   const text = `🎉 Welcome to Home HNI Premium Property Services!

// Hi ${userName || 'there'},

// Congratulations! You've successfully submitted your ${propertyType || 'premium property'} to India's most trusted property platform.

// ${locality || propertyValue ? `
// Your Property Summary:
// Property Type: ${propertyType || 'Premium Property'}
// ${locality ? `Location: ${locality}` : ''}
// ${propertyValue ? `Value: ₹${propertyValue}` : ''}
// Status: Under Premium Review
// ` : ''}

// What Happens Next? (Premium Process)
// • 🔍 Expert Review (6-8 hours): Property specialists verify details
// • 📸 Photo Enhancement: Professional touch-ups
// • 🎯 Market Analysis: Optimal pricing recommendations  
// • ✅ Premium Go-Live: Featured placement across channels
// • 📱 Instant Notifications: Real-time updates on inquiries

// Boost Your Property's Performance!
// Upgrade now and get 3X more visibility + 50% faster deals

// Plans Available:
// FREE - Basic Listing (Standard visibility, 30 days)
// ₹${propertyType === 'Commercial' ? '1499' : propertyType === 'Industrial' ? '1999' : '999'} - Premium Plan (5X visibility, verified contacts, priority support)
// ₹${propertyType === 'Commercial' ? '2499' : propertyType === 'Industrial' ? '2999' : '1999'} - Elite Plan (Featured listings, dedicated advisor, legal support)

// 🎁 Limited Time Bonus: Upgrade within 24 hours - 20% OFF + FREE photography!
// Code: WELCOME20

// Upgrade: ${pricingPlanUrl || 'https://homehni.com/plans?tab=seller'}
// Track Status: https://homehni.com/dashboard

// Get ready to experience the Home HNI advantage!

// Best regards,
// Home HNI Premium Review Team
// © 2025 Home HNI - Premium Property Platform`;

//   const result = await sendEmail({ to, subject, html, text });
//   res.json(result);
// });




////// 11. Property rejected email (Admin reject button)
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

// // 12. Show interest email (Show interest button trigger)  
// app.post("/send-show-interest-email", async (req, res) => {
//   const { to, email, userEmail, ownerEmail, userName, propertyType, locality, propertyPrice, pricingPlanUrl } = req.body;
//   const resolvedTo = (to || email || userEmail || ownerEmail || "").trim();
//   const isValidEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(resolvedTo) && !/@example\.com$/i.test(resolvedTo);
//   if (!isValidEmail) {
//     return res.status(400).json({ status: "error", error: "Invalid recipient email", resolvedTo });
//   }

//   const subject = "🏠 Unlock Premium Property Access - Exclusive Plans for Serious Buyers!";
  
//   const html = `<!DOCTYPE html>
// <html>
// <head><meta charset="UTF-8"><title>Premium Property Access Plans</title></head>
// <body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
//   <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
//     <tr><td align="center">
//       <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
//         <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
//         <tr>
//           <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
//             <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🏠 Welcome to Home HNI Premium Property Access!</h2>
//             <p>Hi ${userName || 'Property Seeker'},</p>
//             <p>Great choice! You've shown interest in premium properties on <strong>Home HNI</strong> - India's most trusted property platform. Now unlock exclusive access to connect directly with verified property owners!</p>

//             ${propertyType || locality || propertyPrice ? `
//             <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
//               <h3 style="color:#d32f2f;margin:0 0 10px;font-size:16px;">🎯 Your Interest Profile:</h3>
//               ${propertyType ? `<p style="margin:5px 0;"><strong>Property Type:</strong> ${propertyType}</p>` : ''}
//               ${locality ? `<p style="margin:5px 0;"><strong>Preferred Location:</strong> ${locality}</p>` : ''}
//               ${propertyPrice ? `<p style="margin:5px 0;"><strong>Budget Range:</strong> ₹${propertyPrice}</p>` : ''}
//               <p style="margin:5px 0;"><strong>Status:</strong> <span style="color:#4caf50;">Ready to Connect!</span></p>
//             </div>
//             ` : ''}

//             <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
//               <h3 style="color:#d32f2f;margin:0 0 10px;">🚀 Why Choose Home HNI Premium Access?</h3>
//               <p style="margin:5px 0;font-weight:bold;color:#4caf50;">✓ Connect with 50,000+ verified property owners</p>
//               <p style="margin:5px 0;font-weight:bold;color:#4caf50;">✓ Get responses 5X faster than competitors</p>
//               <p style="margin:5px 0;font-weight:bold;color:#4caf50;">✓ Access exclusive off-market properties</p>
//               <p style="margin:5px 0;font-weight:bold;color:#4caf50;">✓ Dedicated property advisor support</p>
//             </div>

//             <div style="background:#f0f8ff;padding:25px;border-radius:8px;margin:20px 0;">
//               <h3 style="color:#d32f2f;margin:0 0 20px;text-align:center;font-size:18px;">💎 Choose Your Premium Access Plan:</h3>
              
//               <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;margin:20px 0;">
//                 <div style="background:#fff;padding:20px;border-radius:8px;border:2px solid #e0e0e0;text-align:center;">
//                   <h4 style="color:#4caf50;margin:0 0 10px;font-size:16px;">EXPLORER</h4>
//                   <div style="font-size:24px;font-weight:bold;color:#4caf50;margin:10px 0;">FREE</div>
//                   <ul style="text-align:left;padding-left:15px;margin:15px 0;font-size:13px;">
//                     <li>View basic property details</li>
//                     <li>Limited contact attempts (3/month)</li>
//                     <li>Standard customer support</li>
//                     <li>Access to public listings only</li>
//                   </ul>
//                   <p style="font-size:12px;color:#777;margin:10px 0;">Perfect for casual browsing</p>
//                 </div>
                
//                 <div style="background:#fff;padding:20px;border-radius:8px;border:2px solid:#ff9800;text-align:center;position:relative;">
//                   <div style="background:#ff9800;color:#fff;padding:5px 10px;border-radius:15px;font-size:11px;position:absolute;top:-10px;left:50%;transform:translateX(-50%);font-weight:bold;">MOST POPULAR</div>
//                   <h4 style="color:#ff9800;margin:0 0 10px;font-size:16px;">PREMIUM</h4>
//                   <div style="font-size:24px;font-weight:bold;color:#ff9800;margin:10px 0;">₹${propertyType === 'Commercial' ? '799' : propertyType === 'Industrial' ? '999' : '499'}</div>
//                   <div style="font-size:12px;color:#666;margin-bottom:15px;">per month</div>
//                   <ul style="text-align:left;padding-left:15px;margin:15px 0;font-size:13px;">
//                     <li>Unlimited property contacts</li>
//                     <li>Direct owner phone numbers</li>
//                     <li>Priority customer support</li>
//                     <li>Access to exclusive listings</li>
//                     <li>Property visit scheduling</li>
//                     <li>Market price insights</li>
//                   </ul>
//                   <p style="font-size:12px;color:#777;margin:10px 0;">For serious property seekers</p>
//                 </div>
                
//                 <div style="background:#fff;padding:20px;border-radius:8px;border:2px solid:#d32f2f;text-align:center;">
//                   <h4 style="color:#d32f2f;margin:0 0 10px;font-size:16px;">ELITE</h4>
//                   <div style="font-size:24px;font-weight:bold;color:#d32f2f;margin:10px 0;">₹${propertyType === 'Commercial' ? '1499' : propertyType === 'Industrial' ? '1799' : '999'}</div>
//                   <div style="font-size:12px;color:#666;margin-bottom:15px;">per month</div>
//                   <ul style="text-align:left;padding-left:15px;margin:15px 0;font-size:13px;">
//                     <li>Everything in Premium</li>
//                     <li>Dedicated property advisor</li>
//                     <li>Legal documentation help</li>
//                     <li>Loan assistance & connections</li>
//                     <li>Exclusive pre-launch access</li>
//                     <li>Negotiation support</li>
//                     <li>White-glove service</li>
//                   </ul>
//                   <p style="font-size:12px;color:#777;margin:10px 0;">VIP property buying experience</p>
//                 </div>
//               </div>
//             </div>

//             <p style="text-align:center;margin:28px 0;">
//               <a href="${pricingPlanUrl || 'https://homehni.com/plans?tab=buyer'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">🚀 Choose My Plan</a>
//               <a href="https://homehni.com/properties/search" style="background:#4caf50;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">🔍 Browse Properties</a>
//             </p>

//             <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
//               <h4 style="color:#d32f2f;margin:0 0 10px;">🎁 Limited Time: New Member Special!</h4>
//               <p style="margin:5px 0;"><strong>Sign up for any premium plan within 24 hours and get:</strong></p>
//               <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ 30% OFF first month (Code: NEWMEMBER30)</p>
//               <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ FREE property market report for your area</p>
//               <p style="margin:5px 0;color:#4caf50;font-weight:bold;">✓ Priority access to new listings</p>
//             </div>

//             <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
//               <h4 style="color:#d32f2f;margin:0 0 10px;">📞 Need Help Choosing?</h4>
//               <p style="margin:5px 0;">📱 WhatsApp Advisor: +91-9876543210</p>
//               <p style="margin:5px 0;">📧 Premium Support: premium@homehni.com</p>
//               <p style="margin:5px 0;">⏰ Available: 9 AM - 9 PM (Mon-Sun)</p>
//               <p style="margin:5px 0;">🎯 <strong>Free consultation call available!</strong></p>
//             </div>

//             <p>Join thousands of satisfied property buyers who found their dream homes through Home HNI Premium. Your perfect property is just a click away!</p>
//             <p>Ready to unlock premium access?<br><strong>Home HNI Premium Access Team</strong></p>
//           </td>
//         </tr>
//         <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
//         <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Access</td></tr>
//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;

//   const text = `🏠 Welcome to Home HNI Premium Property Access!

// Hi ${userName || 'Property Seeker'},

// Great choice! You've shown interest in premium properties on Home HNI. Unlock exclusive access to connect directly with verified property owners!

// ${propertyType || locality || propertyPrice ? `
// Your Interest Profile:
// ${propertyType ? `Property Type: ${propertyType}` : ''}
// ${locality ? `Preferred Location: ${locality}` : ''}  
// ${propertyPrice ? `Budget Range: ₹${propertyPrice}` : ''}
// Status: Ready to Connect!
// ` : ''}

// Why Choose Home HNI Premium Access?
// ✓ Connect with 50,000+ verified property owners
// ✓ Get responses 5X faster than competitors
// ✓ Access exclusive off-market properties  
// ✓ Dedicated property advisor support

// Choose Your Premium Access Plan:

// EXPLORER - FREE
// • View basic property details
// • Limited contact attempts (3/month)
// • Standard customer support
// • Access to public listings only

// PREMIUM - ₹${propertyType === 'Commercial' ? '799' : propertyType === 'Industrial' ? '999' : '499'}/month [MOST POPULAR]
// • Unlimited property contacts
// • Direct owner phone numbers  
// • Priority customer support
// • Access to exclusive listings
// • Property visit scheduling
// • Market price insights

// ELITE - ₹${propertyType === 'Commercial' ? '1499' : propertyType === 'Industrial' ? '1799' : '999'}/month
// • Everything in Premium
// • Dedicated property advisor
// • Legal documentation help
// • Loan assistance & connections
// • Exclusive pre-launch access
// • Negotiation support
// • White-glove service

// 🎁 New Member Special (24 hours):
// ✓ 30% OFF first month (Code: NEWMEMBER30)
// ✓ FREE property market report
// ✓ Priority access to new listings

// Need Help Choosing?
// 📱 WhatsApp: +91-9876543210
// 📧 Email: premium@homehni.com
// ⏰ Available: 9 AM - 9 PM (Mon-Sun)

// Choose Plan: ${pricingPlanUrl || 'https://homehni.com/plans?tab=buyer'}
// Browse Properties: https://homehni.com/properties/search

// Your perfect property is just a click away!

// Home HNI Premium Access Team
// © 2025 Home HNI - Premium Property Access`;

//   const result = await sendEmail({ to: resolvedTo, subject, html, text });
//   res.json(result);
// });

// // 13. Mark as rented/sold email - CLEANED VERSION
// app.post("/send-mark-rented-sold-email", async (req, res) => {
//   const { to, userName, propertyType, status, locality, finalPrice, dealDuration } = req.body;
//   if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

//   const dealType = status === 'sold' ? 'Sale' : status === 'rented' ? 'Rental' : 'Deal';
//   const subject = `🎉 Congratulations! Your ${propertyType || 'Property'} ${dealType} is Complete!`;
  
//   const html = `<!DOCTYPE html>
// <html>
// <head><meta charset="UTF-8"><title>Property Deal Successful</title></head>
// <body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
//   <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
//     <tr><td align="center">
//       <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
//         <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
//         <tr>
//           <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
//             <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🎉 Congratulations on Your Successful ${dealType}!</h2>
//             <p>Dear ${userName || 'Valued Customer'},</p>
//             <p>🥳 <strong>Fantastic news!</strong> Your ${propertyType || 'property'} has been successfully <strong>${status || 'closed'}</strong> through Home HNI's platform!</p>

//             ${locality || finalPrice || dealDuration ? `
//             <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;">
//               <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">📋 ${dealType} Summary:</h3>
//               <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
//                 <tr><td style="padding:8px 0;width:40%;"><strong>Property Type:</strong></td><td>${propertyType || 'Premium Property'}</td></tr>
//                 ${locality ? `<tr><td style="padding:8px 0;"><strong>Location:</strong></td><td>${locality}</td></tr>` : ''}
//                 ${finalPrice ? `<tr><td style="padding:8px 0;"><strong>${dealType} Price:</strong></td><td>₹${finalPrice}</td></tr>` : ''}
//                 ${dealDuration ? `<tr><td style="padding:8px 0;"><strong>Time to Close:</strong></td><td>${dealDuration} days</td></tr>` : ''}
//                 <tr><td style="padding:8px 0;"><strong>Status:</strong></td><td><span style="color:#4caf50;font-weight:bold;">✅ ${dealType} Complete</span></td></tr>
//               </table>
//             </div>
//             ` : ''}

//             <div style="background:#e3f2fd;padding:20px;border-radius:8px;margin:20px 0;">
//               <h4 style="color:#d32f2f;margin:0 0 15px;">📞 Need Support?</h4>
//               <p style="margin:5px 0;">📱 Contact us: +91-9876543210</p>
//               <p style="margin:5px 0;">📧 Email: support@homehni.com</p>
//               <p style="margin:5px 0;">⏰ Available: Monday - Saturday, 9 AM - 7 PM</p>
//             </div>

//             <p style="text-align:center;margin:28px 0;">
//               <a href="https://homehni.com/dashboard" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 25px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">📋 View Dashboard</a>
//             </p>

//             <p>Thank you for choosing Home HNI for your property ${dealType.toLowerCase()}. We're pleased to have helped you achieve a successful transaction.</p>
//             <p>Best regards,<br><strong>Home HNI Team</strong></p>
//           </td>
//         </tr>
//         <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
//         <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Your Trusted Property Platform</td></tr>
//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;

//   const text = `🎉 Congratulations on Your Successful ${dealType}!

// Dear ${userName || 'Valued Customer'},

// 🥳 Fantastic news! Your ${propertyType || 'property'} has been successfully ${status || 'closed'} through Home HNI's platform!

// ${locality || finalPrice || dealDuration ? `
// ${dealType} Summary:
// Property Type: ${propertyType || 'Premium Property'}
// ${locality ? `Location: ${locality}` : ''}
// ${finalPrice ? `${dealType} Price: ₹${finalPrice}` : ''}
// ${dealDuration ? `Time to Close: ${dealDuration} days` : ''}
// Status: ✅ ${dealType} Complete
// ` : ''}

// Need Support?
// 📱 Contact us: +91-9876543210
// 📧 Email: support@homehni.com
// ⏰ Available: Monday - Saturday, 9 AM - 7 PM

// Dashboard: https://homehni.com/dashboard

// Thank you for choosing Home HNI for your property ${dealType.toLowerCase()}. We're pleased to have helped you achieve a successful transaction.

// Best regards,
// Home HNI Team
// © 2025 Home HNI - Your Trusted Property Platform`;

//   const result = await sendEmail({ to, subject, html, text });
//   res.json(result);
// });

// 14. Contact owner email (Contact owner button trigger)
app.post("/send-contact-owner-email", async (req, res) => {
  const { to, userName, propertyAddress, propertyType, interestedUserName, interestedUserEmail, interestedUserPhone, dashboardUrl } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = "🔥 Property Inquiry Received - Connect with Your Lead";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Property Inquiry Received</title>
</head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
          <tr>
            <td align="center" style="background:#d32f2f;padding:20px;">
              <img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI">
            </td>
          </tr>
          <tr>
            <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
              <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🔥 Property Inquiry Received</h2>
              <p>Hi ${userName || 'Property Owner'},</p>
              <p>A potential buyer/renter has shown interest in your property listed on Home HNI.</p>

              <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
                <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">Property Details:</h3>
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                  <tr>
                    <td style="padding:8px 0;width:40%;"><strong>Property:</strong></td>
                    <td>${propertyAddress || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;"><strong>Type:</strong></td>
                    <td>${propertyType || 'N/A'}</td>
                  </tr>
                </table>
              </div>

              <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin:20px 0;">
                <h3 style="color:#d32f2f;margin:0 0 15px;font-size:16px;">Inquirer Details:</h3>
                <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                  <tr>
                    <td style="padding:8px 0;width:40%;"><strong>Name:</strong></td>
                    <td>${interestedUserName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;"><strong>Email:</strong></td>
                    <td>${interestedUserEmail || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;"><strong>Phone:</strong></td>
                    <td>${interestedUserPhone || 'N/A'}</td>
                  </tr>
                </table>
              </div>

              <p style="text-align:center;margin:28px 0;">
                <a href="${dashboardUrl || 'https://homehni.in/dashboard?tab=leads'}" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 32px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">View Lead Details</a>
              </p>

              <p>Thank you for using Home HNI!</p>
              <p><strong>Home HNI Team</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #eee;margin:0;">
            </td>
          </tr>
          <tr>
            <td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">
              &copy; 2025 Home HNI - Premium Property Platform
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `🔥 Property Inquiry Received

Hi ${userName || 'Property Owner'},

A potential buyer/renter has shown interest in your property listed on Home HNI.

Property Details:
- Property: ${propertyAddress || 'N/A'}
- Type: ${propertyType || 'N/A'}

Inquirer Details:
- Name: ${interestedUserName || 'N/A'}
- Email: ${interestedUserEmail || 'N/A'}
- Phone: ${interestedUserPhone || 'N/A'}

View Lead Details: ${dashboardUrl || 'https://homehni.com/dashboard/leads'}

Thank you for using Home HNI!

Home HNI Team
© 2025 Home HNI - Premium Property Platform`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});




// // 15. Visit scheduled email (Show Interest form submission)
// app.post("/send-visit-scheduled-email", async (req, res) => {
//   const { to, userName, propertyAddress, propertyType, visitorName, visitorPhone, visitorEmail, visitDate, visitTime, message } = req.body;
//   if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

//   const subject = "🏠 Property Visit Scheduled - Prepare for Success!";
  
//   const html = `<!DOCTYPE html>
// <html>
// <head><meta charset="UTF-8"><title>Premium Property Visit Scheduled</title></head>
// <body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
//   <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
//     <tr><td align="center">
//       <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
//         <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
//         <tr>
//           <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
//             <h2 style="margin:0 0 10px;color:#d32f2f;font-size:22px;">🏠 Property Visit Scheduled - Get Ready to Close!</h2>
//             <p>Dear ${userName || 'Property Owner'},</p>
//             <p>🎉 <strong>Outstanding news!</strong> You've got a confirmed property visit scheduled. This is your golden opportunity to convert interest into a successful deal!</p>

//             <div style="background:#e8f5e8;padding:25px;border-radius:8px;margin:20px 0;">
//               <h3 style="color:#d32f2f;margin:0 0 15px;text-align:center;font-size:18px;">📅 Visit Appointment Details</h3>
              
//               <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#fff;border-radius:5px;overflow:hidden;">
//                 <tr style="background:#f8f9fa;">
//                   <td style="padding:12px;border-bottom:1px solid #e0e0e0;width:35%;"><strong>Property:</strong></td>
//                   <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${propertyAddress || 'Your Premium Property'}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Property Type:</strong></td>
//                   <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${propertyType || 'Premium Property'}</td>
//                 </tr>
//                 <tr style="background:#f8f9fa;">
//                   <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Visitor Name:</strong></td>
//                   <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${visitorName || 'Interested Buyer'}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Contact Phone:</strong></td>
//                   <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${visitorPhone || 'Available in dashboard'}</td>
//                 </tr>
//                 ${visitorEmail ? `
//                 <tr style="background:#f8f9fa;">
//                   <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Email:</strong></td>
//                   <td style="padding:12px;border-bottom:1px solid #e0e0e0;">${visitorEmail}</td>
//                 </tr>
//                 ` : ''}
//                 <tr>
//                   <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><strong>Visit Date:</strong></td>
//                   <td style="padding:12px;border-bottom:1px solid #e0e0e0;"><span style="color:#d32f2f;font-weight:bold;">${visitDate || 'To be confirmed'}</span></td>
//                 </tr>
//                 <tr style="background:#f8f9fa;">
//                   <td style="padding:12px;"><strong>Visit Time:</strong></td>
//                   <td style="padding:12px;"><span style="color:#d32f2f;font-weight:bold;">${visitTime || 'To be confirmed'}</span></td>
//                 </tr>
//               </table>
              
//               ${message ? `
//               <div style="background:#fff3cd;padding:15px;border-radius:5px;margin:15px 0;">
//                 <strong>📝 Special Message from Visitor:</strong><br>
//                 "${message}"
//               </div>
//               ` : ''}
//             </div>

//             <div style="background:#f0f8ff;padding:25px;border-radius:8px;margin:20px 0;">
//               <h3 style="color:#d32f2f;margin:0 0 15px;font-size:18px;">🎯 Pre-Visit Success Checklist:</h3>
              
//               <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
//                 <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
//                   <strong>🏠 Property Preparation</strong><br>
//                   <small>• Deep clean all rooms<br>• Enhance lighting & ventilation<br>• Remove clutter & personal items<br>• Fix minor repairs if any</small>
//                 </div>
//                 <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
//                   <strong>📋 Documentation Ready</strong><br>
//                   <small>• Property documents<br>• NOC certificates<br>• Recent photos/videos<br>• Price negotiation strategy</small>
//                 </div>
//                 <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
//                   <strong>🗣️ Communication Prep</strong><br>
//                   <small>• Highlight unique features<br>• Know neighborhood benefits<br>• Prepare FAQs answers<br>• Set clear next steps</small>
//                 </div>
//                 <div style="background:#fff;padding:15px;border-radius:5px;border-left:3px solid #4caf50;">
//                   <strong>🤝 Closing Strategy</strong><br>
//                   <small>• Know your bottom price<br>• Flexible payment terms<br>• Quick decision incentives<br>• Follow-up plan ready</small>
//                 </div>
//               </div>
//             </div>

//             <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
//               <h4 style="color:#d32f2f;margin:0 0 10px;">⚡ Visit Day Success Tips:</h4>
//               <p style="margin:5px 0;font-weight:bold;">✓ Arrive 15 minutes early to prepare</p>
//               <p style="margin:5px 0;font-weight:bold;">✓ Greet warmly & build rapport first</p>
//               <p style="margin:5px 0;font-weight:bold;">✓ Share neighborhood stories & benefits</p>
//               <p style="margin:5px 0;font-weight:bold;">✓ Address concerns proactively</p>
//               <p style="margin:5px 0;font-weight:bold;">✓ Ask for commitment before they leave</p>
//             </div>

//             <p style="text-align:center;margin:28px 0;">
//               <a href="https://homehni.com/dashboard/visits" style="background:#d32f2f;color:#fff;text-decoration:none;padding:16px 25px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;margin-right:10px;">📅 Manage Visits</a>
//               <a href="https://homehni.com/visit-preparation-guide" style="background:#4caf50;color:#fff;text-decoration:none;padding:16px 25px;border-radius:5px;font-weight:bold;font-size:16px;display:inline-block;">📖 Visit Guide</a>
//             </p>

//             <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
//               <h4 style="color:#d32f2f;margin:0 0 10px;">📞 Visit Day Support Available:</h4>
//               <p style="margin:5px 0;">📱 Emergency Support: +91-9876543210</p>
//               <p style="margin:5px 0;">📧 Visit Coordinator: visits@homehni.com</p>
//               <p style="margin:5px 0;">⏰ Available: 24/7 on visit days</p>
//               <p style="margin:5px 0;">🎯 <strong>Call us if visitor doesn't show up!</strong></p>
//             </div>

//             <p><strong>Statistical Fact:</strong> Well-prepared property visits have an <span style="color:#4caf50;font-weight:bold;">85% higher conversion rate</span>. You're just one great visit away from closing your deal!</p>
//             <p>Wishing you a successful property visit and deal closure!<br><strong>Home HNI Visit Coordination Team</strong></p>
//           </td>
//         </tr>
//         <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
//         <tr><td align="center" style="background:#f9f9f9;padding:18px 20px;font-size:13px;color:#777;">&copy; 2025 Home HNI - Premium Property Visit Management</td></tr>
//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;

//   const text = `🏠 Property Visit Scheduled - Get Ready to Close!

// Dear ${userName || 'Property Owner'},

// 🎉 Outstanding news! You've got a confirmed property visit scheduled. This is your opportunity to convert interest into a successful deal!

// 📅 Visit Appointment Details:
// Property: ${propertyAddress || 'Your Premium Property'}
// Property Type: ${propertyType || 'Premium Property'}
// Visitor Name: ${visitorName || 'Interested Buyer'}
// Contact Phone: ${visitorPhone || 'Available in dashboard'}
// ${visitorEmail ? `Email: ${visitorEmail}` : ''}
// Visit Date: ${visitDate || 'To be confirmed'}
// Visit Time: ${visitTime || 'To be confirmed'}

// ${message ? `📝 Special Message from Visitor: "${message}"` : ''}

// 🎯 Pre-Visit Success Checklist:

// 🏠 Property Preparation:
// • Deep clean all rooms
// • Enhance lighting & ventilation  
// • Remove clutter & personal items
// • Fix minor repairs if any

// 📋 Documentation Ready:
// • Property documents
// • NOC certificates
// • Recent photos/videos
// • Price negotiation strategy

// 🗣️ Communication Prep:
// • Highlight unique features
// • Know neighborhood benefits
// • Prepare FAQs answers
// • Set clear next steps

// 🤝 Closing Strategy:
// • Know your bottom price
// • Flexible payment terms
// • Quick decision incentives
// • Follow-up plan ready

// ⚡ Visit Day Success Tips:
// ✓ Arrive 15 minutes early to prepare
// ✓ Greet warmly & build rapport first
// ✓ Share neighborhood stories & benefits
// ✓ Address concerns proactively
// ✓ Ask for commitment before they leave

// Visit Day Support:
// 📱 Emergency Support: +91-9876543210
// 📧 Visit Coordinator: visits@homehni.com
// ⏰ Available: 24/7 on visit days

// Manage Visits: https://homehni.com/dashboard/visits
// Visit Guide: https://homehni.com/visit-preparation-guide

// Well-prepared visits have 85% higher conversion rate!

// Home HNI Visit Coordination Team
// © 2025 Home HNI - Premium Property Visit Management`;

//   const result = await sendEmail({ to, subject, html, text });
//   res.json(result);
// });


// 16. Payment success email
app.post("/send-payment-success-email", async (req, res) => {
  const { 
    to, 
    userName, 
    planName, 
    planType, 
    amount, 
    transactionId, 
    planDuration, 
    nextBillingDate,
    paymentDate = new Date().toLocaleDateString(),
    gstAmount,
    totalAmount,
    features = [] // Array of plan features
  } = req.body;

  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = `🎉 Payment Successful - Welcome to ${planName}!`;
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Payment Successful - ${planName}</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 20px;color:#d32f2f;font-size:24px;">🎉 Payment Successful!</h2>
            <p>Dear ${userName || 'Valued Member'},</p>
            <p>Thank you for subscribing to <strong>${planName}</strong>. Your payment has been successfully processed.</p>

            <div style="background:#e8f5e8;padding:25px;border-radius:8px;margin:20px 0;">
              <h3 style="color:#d32f2f;margin:0 0 15px;">Payment Details</h3>
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #ddd;">Plan Name:</td>
                  <td style="padding:8px 0;border-bottom:1px solid #ddd;font-weight:bold;">${planName}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #ddd;">Plan Type:</td>
                  <td style="padding:8px 0;border-bottom:1px solid #ddd;">${planType}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #ddd;">Duration:</td>
                  <td style="padding:8px 0;border-bottom:1px solid #ddd;">${planDuration}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #ddd;">Base Amount:</td>
                  <td style="padding:8px 0;border-bottom:1px solid #ddd;">₹${amount}</td>
                </tr>
                ${gstAmount ? `
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #ddd;">GST (18%):</td>
                  <td style="padding:8px 0;border-bottom:1px solid #ddd;">₹${gstAmount}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:8px 0;font-weight:bold;">Total Amount:</td>
                  <td style="padding:8px 0;font-weight:bold;color:#d32f2f;">₹${totalAmount || amount}</td>
                </tr>
              </table>
            </div>

            <div style="background:#f0f8ff;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 15px;">Subscription Details</h4>
              <p style="margin:5px 0;">🗓️ Start Date: ${paymentDate}</p>
              ${nextBillingDate ? `<p style="margin:5px 0;">🔄 Next Billing: ${nextBillingDate}</p>` : ''}
              <p style="margin:5px 0;">🆔 Transaction ID: ${transactionId}</p>
            </div>

            <div style="text-align:center;margin:30px 0;">
              <a href="https://homehni.com/dashboard" style="background:#d32f2f;color:#fff;text-decoration:none;padding:15px 30px;border-radius:5px;font-weight:bold;display:inline-block;margin:10px;">Access Dashboard</a>
            </div>

            <p style="color:#666;font-size:14px;">A detailed invoice will be sent to your email shortly.</p>
            
            <p>Thank you for choosing Home HNI!</p>
            <p><strong>Home HNI Team</strong></p>
          </td>
        </tr>
        <tr><td align="center" style="background:#f9f9f9;padding:20px;font-size:13px;color:#777;">
          © 2025 Home HNI - All rights reserved
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🎉 Payment Successful!

Dear ${userName || 'Valued Member'},

Thank you for subscribing to ${planName}. Your payment has been successfully processed.

Payment Details:
---------------
Plan Name: ${planName}
Plan Type: ${planType}
Duration: ${planDuration}
Base Amount: ₹${amount}
${gstAmount ? `GST (18%): ₹${gstAmount}
` : ''}Total Amount: ₹${totalAmount || amount}

Subscription Details:
-------------------
Start Date: ${paymentDate}
${nextBillingDate ? `Next Billing: ${nextBillingDate}
` : ''}Transaction ID: ${transactionId}

Access your dashboard: https://homehni.com/dashboard

A detailed invoice will be sent to your email shortly.

Thank you for choosing Home HNI!

Home HNI Team
© 2025 Home HNI - All rights reserved`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});

// 17. Payment invoice email
app.post("/send-payment-invoice-email", async (req, res) => {
  const { 
    to, 
    userName, 
    invoiceNumber,
    planName, 
    planType, 
    amount,
    gstAmount,
    totalAmount,
    transactionId,
    paymentDate = new Date().toLocaleDateString(),
    billingAddress,
    planDuration,
    gstNumber = '27AAAAA0000A1Z5'
  } = req.body;

  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  const subject = `Invoice #${invoiceNumber} - Home HNI ${planName}`;
  
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Invoice - Home HNI</title></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        <tr><td align="center" style="background:#d32f2f;padding:20px;"><img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI"></td></tr>
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:30px;">
              <tr>
                <td>
                  <h2 style="margin:0;color:#d32f2f;">TAX INVOICE</h2>
                  <p style="margin:5px 0;color:#666;">Invoice Date: ${paymentDate}</p>
                </td>
                <td align="right">
                  <p style="margin:0;font-weight:bold;">Invoice #${invoiceNumber}</p>
                  <p style="margin:5px 0;color:#666;">GST: ${gstNumber}</p>
                </td>
              </tr>
            </table>

            <div style="margin-bottom:30px;">
              <div style="background:#f8f9fa;padding:20px;border-radius:8px;">
                <h3 style="margin:0 0 10px;font-size:16px;">Bill To:</h3>
                <p style="margin:0;">${userName}</p>
                ${billingAddress ? `<p style="margin:5px 0;color:#666;">${billingAddress}</p>` : ''}
              </div>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:30px;">
              <tr style="background:#f8f9fa;">
                <th style="padding:10px;text-align:left;border-bottom:2px solid #ddd;">Description</th>
                <th style="padding:10px;text-align:center;border-bottom:2px solid #ddd;">Duration</th>
                <th style="padding:10px;text-align:right;border-bottom:2px solid #ddd;">Amount</th>
              </tr>
              <tr>
                <td style="padding:15px 10px;border-bottom:1px solid #ddd;">
                  ${planName}<br>
                  <small style="color:#666;">${planType}</small>
                </td>
                <td style="padding:15px 10px;text-align:center;border-bottom:1px solid #ddd;">${planDuration}</td>
                <td style="padding:15px 10px;text-align:right;border-bottom:1px solid #ddd;">₹${amount}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding:10px;text-align:right;border-bottom:1px solid #ddd;">Subtotal:</td>
                <td style="padding:10px;text-align:right;border-bottom:1px solid #ddd;">₹${amount}</td>
              </tr>
              ${gstAmount ? `
              <tr>
                <td colspan="2" style="padding:10px;text-align:right;border-bottom:1px solid #ddd;">GST (18%):</td>
                <td style="padding:10px;text-align:right;border-bottom:1px solid #ddd;">₹${gstAmount}</td>
              </tr>` : ''}
              <tr>
                <td colspan="2" style="padding:15px 10px;text-align:right;font-weight:bold;">Total:</td>
                <td style="padding:15px 10px;text-align:right;font-weight:bold;color:#d32f2f;">₹${totalAmount || amount}</td>
              </tr>
            </table>

            <div style="background:#e8f5e8;padding:20px;border-radius:8px;margin-bottom:30px;">
              <h4 style="margin:0 0 10px;color:#d32f2f;">Payment Information</h4>
              <p style="margin:5px 0;">Status: <strong style="color:#4caf50;">PAID</strong></p>
              <p style="margin:5px 0;">Transaction ID: ${transactionId}</p>
              <p style="margin:5px 0;">Payment Date: ${paymentDate}</p>
            </div>

            <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">

            <p style="font-size:14px;color:#666;text-align:center;">This is a computer-generated invoice and does not require a signature.</p>
          </td>
        </tr>
        <tr><td align="center" style="background:#f9f9f9;padding:20px;font-size:13px;color:#777;">
          © 2025 Home HNI | GST: ${gstNumber}<br>
          support@homehni.com | +91-9876543210
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `TAX INVOICE

Invoice #${invoiceNumber}
Date: ${paymentDate}
GST: ${gstNumber}

Bill To:
${userName}


Description:
${planName} (${planType})
Duration: ${planDuration}
Amount: ₹${amount}

${gstAmount ? `GST (18%): ₹${gstAmount}
` : ''}Total Amount: ₹${totalAmount || amount}

Payment Information:
-------------------
Status: PAID
Transaction ID: ${transactionId}
Payment Date: ${paymentDate}

This is a computer-generated invoice and does not require a signature.

© 2025 Home HNI | GST: ${gstNumber}
support@homehni.com | +91-9876543210`;

  const result = await sendEmail({ to, subject, html, text });
  res.json(result);
});



// 18. Services application email (Services tab form submission)
app.post("/send-services-application-email", async (req, res) => {
  const { to, userName, serviceType } = req.body;
  if (!to) return res.status(400).json({ status: "error", error: "Email address required" });

  // Map service IDs to display names
  const serviceNames = {
    'loans': 'Loans Service',
    'home-security': 'Home Security Service',
    'packers-movers': 'Packers & Movers Service',
    'legal-services': 'Legal Service',
    'handover-services': 'Handover Service',
    'property-management': 'Property Management Service',
    'architects': 'Architects Service',
    'painting-cleaning': 'Painting & Cleaning Service',
    'interior-design': 'Interior Design Service'
  };

  const serviceName = serviceNames[serviceType] || serviceType || 'Premium Service';
  const subject = `🎯 Thank You for Booking ${serviceName} - Home HNI`;
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Service Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 0;background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);overflow:hidden;">
        
        <!-- Header -->
        <tr>
          <td align="center" style="background:#d32f2f;padding:20px;">
            <img src="https://homehni.in/lovable-uploads/main-logo-final.png" width="150" alt="Home HNI">
          </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td style="padding:40px;color:#333;font-size:16px;line-height:1.6;">
            <h2 style="margin:0 0 20px;color:#d32f2f;font-size:24px;text-align:center;">
              🎉 Thank You for Booking Our ${serviceName}!
            </h2>
            
            <p style="font-size:18px;margin-bottom:20px;">Dear ${userName || 'Valued Customer'},</p>
            
            <div style="background:#e8f5e8;padding:25px;border-radius:8px;margin:20px 0;text-align:center;">
              <h3 style="color:#d32f2f;margin:0 0 15px;font-size:20px;">✅ Your Service Request is Confirmed!</h3>
              <p style="font-size:18px;margin:10px 0;font-weight:bold;">Service Selected: <span style="color:#d32f2f;">${serviceName}</span></p>
              <p style="font-size:16px;margin:15px 0;">Our expert agents will contact you within <strong style="color:#d32f2f;">12 hours</strong> to discuss your requirements and schedule the service.</p>
            </div>

            <div style="background:#f0f8ff;padding:25px;border-radius:8px;margin:20px 0;text-align:center;">
              <h4 style="color:#d32f2f;margin:0 0 15px;font-size:18px;">🕐 What Happens Next?</h4>
              <p style="margin:10px 0;font-size:16px;">📞 Our service expert will call you within 12 hours</p>
              <p style="margin:10px 0;font-size:16px;">📋 We'll understand your specific requirements</p>
              <p style="margin:10px 0;font-size:16px;">💰 You'll receive a transparent quotation</p>
              <p style="margin:10px 0;font-size:16px;">✅ Professional service delivery begins</p>
            </div>

            <div style="background:#fff3cd;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">🌟 Meanwhile, Explore More!</h4>
              <p style="margin:15px 0;">
                <a href="https://homehni.com/properties" style="background:#d32f2f;color:#fff;text-decoration:none;padding:12px 20px;border-radius:5px;font-weight:bold;margin:5px;display:inline-block;">🏠 Browse Properties</a>
                <a href="https://homehni.com/plans" style="background:#ff9800;color:#fff;text-decoration:none;padding:12px 20px;border-radius:5px;font-weight:bold;margin:5px;display:inline-block;">📋 View Plans</a>
              </p>
            </div>

            <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0;">
              <h4 style="color:#d32f2f;margin:0 0 10px;">📞 Need Immediate Assistance?</h4>
              <p style="margin:5px 0;">📱 <strong>WhatsApp:</strong> +91-9876543210</p>
              <p style="margin:5px 0;">📧 <strong>Email:</strong> services@homehni.com</p>
              <p style="margin:5px 0;">⏰ <strong>Hours:</strong> 8 AM - 8 PM (Mon-Sun)</p>
            </div>

            <p style="margin:20px 0;">Thank you for choosing Home HNI. We're committed to providing you with exceptional service!</p>
            
            <p>Best regards,<br><strong>Team Home HNI</strong></p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td align="center" style="background:#f9f9f9;padding:20px;font-size:13px;color:#777;">
            &copy; 2025 Home HNI - Your Trusted Property Service Partner
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `🎉 Thank You for Booking Our ${serviceName}!

Dear ${userName || 'Valued Customer'},

✅ Your Service Request is Confirmed!
Service Selected: ${serviceName}

Our expert agents will contact you within 12 hours to discuss your requirements and schedule the service.

🕐 What Happens Next?
📞 Our service expert will call you within 12 hours
📋 We'll understand your specific requirements  
💰 You'll receive a transparent quotation
✅ Professional service delivery begins

🌟 Meanwhile, Explore More!
📋 View Plans: https://homehni.com/plans

📞 Need Immediate Assistance?
📱 WhatsApp: +91-9876543210
📧 Email: services@homehni.com
⏰ Hours: 8 AM - 8 PM (Mon-Sun)

Thank you for choosing Home HNI!

Best regards,
Team Home HNI

© 2025 Home HNI - Your Trusted Property Service Partner`;

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
