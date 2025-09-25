import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
    };

    // Add HTML if provided, otherwise use text
    if (html) {
      mailOptions.html = html;
      mailOptions.text = text; // Fallback text version
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
