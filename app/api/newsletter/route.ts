import { NextResponse, NextRequest } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // configure your mail transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER || "st19932000@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD || "gxsrqsrbkjigkpzb",
      },
    })

    // HTML content for a nicer email
    const htmlContent = `
      <div style="font-family: 'Arial', sans-serif; background-color: #f5f5f7; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(90deg, #9A2FC4, #FF9149); padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 24px;">New Newsletter Subscriber</h2>
          </div>
          <div style="padding: 20px; color: #333333;">
            <p>Hello Enginow Team,</p>
            <p>You have a new newsletter subscriber! 🎉</p>
            <p style="font-weight: bold; font-size: 16px;">Subscriber Email:</p>
            <p style="background-color: #f0f0f5; padding: 10px 15px; border-radius: 6px; font-size: 14px;">${email}</p>
            <p style="margin-top: 20px; font-size: 12px; color: #777;">This email was generated automatically from Enginow Newsletter subscription form.</p>
          </div>
          <div style="background-color: #fafafa; padding: 10px 20px; text-align: center; font-size: 12px; color: #999;">
            &copy; ${new Date().getFullYear()} Enginow. All rights reserved.
          </div>
        </div>
      </div>
    `

    // send the mail to care@enginow.in
    await transporter.sendMail({
      from: `"Enginow Newsletter" <${process.env.GMAIL_USER}>`,
      to:"chingarihub@gmail.com",
      subject: "🎉 New Newsletter Subscriber",
      text: `New subscriber email: ${email}`,
      html: htmlContent,
    })

    return NextResponse.json({ message: "Subscribed successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
