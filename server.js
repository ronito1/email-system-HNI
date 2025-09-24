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

  const subject = "Welcome to HomeHNI! 🏡";
  const text = `Hi ${userName || 'there'}!

Welcome to HomeHNI! We're excited to have you join our community.

Here's what you can do next:
• Explore our platform and discover amazing features
• Complete your profile to get personalized recommendations
• Connect with other members in your area

If you have any questions, feel free to reach out to our support team.

Best regards,
The HomeHNI Team

---
This email was sent because you recently signed up for HomeHNI. If you didn't sign up, please ignore this email.`;

  const result = await sendEmail({ to, subject, text });
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
