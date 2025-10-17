import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Configure transporter (for Gmail you need App Password, not account password)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your gmail
        pass: process.env.GMAIL_PASS, // your app password
      },
    });

    await transporter.sendMail({
      from: `"Enginow" <${process.env.GMAIL_USER}>`,
      to: "chingarihub@gmail.com",
      subject: "New Enrollment Request",
      text: `New Enrollment Details:
First Name: ${body.firstName}
Last Name: ${body.lastName}
Email: ${body.email}
Phone: ${body.phone}
City: ${body.city}
State: ${body.state}
Education: ${body.education}
Experience: ${body.experience}
Motivation: ${body.motivation}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
