import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  from: '"Home HNI" <homehni8@gmail.com>', // Update this line
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: '"Home HNI" <homehni8@gmail.com>', // Update this line
      to,
      subject,
    };

    // Add HTML if provided, otherwise use text
    if (html) {
      mailOptions.html = html;
      mailOptions.text = text; // Fallback text version

      // Attach inline logo if referenced via cid
      if (html.includes('cid:homehni_logo')) {
        mailOptions.attachments = [
          {
            filename: 'logo.jpg',
            path: path.join(__dirname, 'logo.jpg'),
            cid: 'homehni_logo',
          },
        ];
      }
    } else {
      mailOptions.text = text;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { status: "sent", id: info.messageId };
  } catch (err) {
    console.error("Error sending email:", err);
    return { status: "error", error: err.message };
  }
};