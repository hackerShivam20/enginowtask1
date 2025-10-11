// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // Ensures this route runs on Node runtime

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // change .env.local file according to app key or mail id
        user: process.env.GMAIL_USER || "st19932000@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD || "gxsrqsrbkjigkpzb",
      },
    });

    const mailOptions = {
      from: `"Enginow Contact Form" <${
        process.env.GMAIL_USER || "your-email@gmail.com"
      }>`,
      to: "chingarihub@gmail.com", // your recipient
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px;">New Contact Form Submission</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Enginow Website</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0; color: #333;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
                <td style="padding: 8px 0; color: #333;">${subject}</td>
              </tr>
            </table>
          </div>

          <div style="background: #fff; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #333; line-height: 1.6; margin: 0;">${message}</p>
          </div>

          <div style="text-align: center; margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 8px;">
            <p style="margin: 0; color: #28a745; font-weight: bold;">📧 Please respond to: ${email}</p>
          </div>

          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
            <p>This email was sent from the Enginow contact form at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission - Enginow Website

Contact Details:
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Please respond to: ${email}

Submitted at: ${new Date().toLocaleString()}
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("❌ Error sending contact form email:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to send message. Please try again or contact us directly at care@enginow.in",
      },
      { status: 500 }
    );
  }
}
