import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // Ensures this route runs on Node runtime

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      whatsapp,
      linkedin,
      city,
      state,
      education,
      experience,
      motivation,
      referralCode,
      programId,
    } = body;

    // ✅ Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !city ||
      !state ||
      !education ||
      !experience ||
      !programId
    ) {
      return NextResponse.json(
        { success: false, error: "Please fill all required fields" },
        { status: 400 }
      );
    }

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER || "your-email@gmail.com",
        pass: process.env.GMAIL_PASS || "your-app-password",
      },
    });

    // ✅ Build email content
    const mailOptions = {
      from: `"Enginow Training Enrollment" <${
        process.env.GMAIL_USER || "your-email@gmail.com"
      }>`,
      to: "chingarihub@gmail.com", // where enrollment details go
      subject: `New Training Enrollment - ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:10px;">
          <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:20px;border-radius:8px;text-align:center;margin-bottom:20px;">
            <h2 style="margin:0;font-size:24px;">New Training Enrollment</h2>
            <p style="margin:5px 0 0 0;opacity:0.9;">Enginow Website</p>
          </div>
          
          <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h3 style="color:#333;margin-top:0;">Student Details:</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;font-weight:bold;color:#555;width:140px;">Name:</td><td style="padding:8px 0;color:#333;">${firstName} ${lastName}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Email:</td><td style="padding:8px 0;color:#333;">${email}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Phone:</td><td style="padding:8px 0;color:#333;">${phone}</td></tr>
              ${
                whatsapp
                  ? `<tr><td style="padding:8px 0;font-weight:bold;color:#555;">WhatsApp:</td><td style="padding:8px 0;color:#333;">${whatsapp}</td></tr>`
                  : ""
              }
              ${
                linkedin
                  ? `<tr><td style="padding:8px 0;font-weight:bold;color:#555;">LinkedIn:</td><td style="padding:8px 0;color:#333;">${linkedin}</td></tr>`
                  : ""
              }
              <tr><td style="padding:8px 0;font-weight:bold;color:#555;">City:</td><td style="padding:8px 0;color:#333;">${city}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#555;">State:</td><td style="padding:8px 0;color:#333;">${state}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Education:</td><td style="padding:8px 0;color:#333;">${education}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Experience:</td><td style="padding:8px 0;color:#333;">${experience}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Program ID:</td><td style="padding:8px 0;color:#333;">${programId}</td></tr>
              ${
                referralCode
                  ? `<tr><td style="padding:8px 0;font-weight:bold;color:#555;">Referral Code:</td><td style="padding:8px 0;color:#333;">${referralCode}</td></tr>`
                  : ""
              }
            </table>
          </div>

          ${
            motivation
              ? `<div style="background:#fff;padding:20px;border:1px solid #eee;border-radius:8px;">
            <h3 style="color:#333;margin-top:0;">Motivation / Goals:</h3>
            <p style="color:#333;line-height:1.6;margin:0;">${motivation}</p>
          </div>`
              : ""
          }

          <div style="text-align:center;margin-top:20px;padding:15px;background:#e8f5e8;border-radius:8px;">
            <p style="margin:0;color:#28a745;font-weight:bold;">📧 Please respond to: ${email}</p>
          </div>

          <div style="text-align:center;margin-top:20px;font-size:12px;color:#666;">
            <p>This email was sent from the Enginow training enrollment form at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Enrollment submitted successfully! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("❌ Error sending enrollment email:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to submit enrollment. Please try again or contact us directly at care@enginow.in",
      },
      { status: 500 }
    );
  }
}
