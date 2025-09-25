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
