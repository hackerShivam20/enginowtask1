import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// NOTE: do NOT set `export const runtime = "edge"` in this file — nodemailer needs Node runtime.

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const phone = formData.get("phone") || "";
    const resume = formData.get("resume"); // File/Blob

    // Build attachments only if file present
    const attachments = [];
    if (resume instanceof File) {
      const ab = await resume.arrayBuffer();
      const buffer = Buffer.from(ab);
      const filename = resume.name || "resume";
      attachments.push({
        filename,
        content: buffer,
        contentType: resume.type || "application/octet-stream",
      });
    }

    // Create transporter (explicit SMTP settings tend to be more reliable)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "chingarihub@gmail.com",
      subject: `New Job Application - ${name || "Unknown"}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info?.messageId);

    return NextResponse.json({ success: true, message: "Application sent." });
  } catch (error) {
    console.error("Apply API error:", error);
    return NextResponse.json(
      { success: false, message: "Error sending application", error: String(error) },
      { status: 500 }
    );
  }
}















// import { NextRequest, NextResponse } from "next/server"
// import nodemailer from "nodemailer"

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData()

//     const name = formData.get("name") as string
//     const email = formData.get("email") as string
//     const phone = formData.get("phone") as string
//     const resume = formData.get("resume") as File

//     if (!name || !email || !phone || !resume) {
//       return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
//     }

//     // Convert resume file → Buffer
//     const arrayBuffer = await resume.arrayBuffer()
//     const buffer = Buffer.from(arrayBuffer)

//     // Configure Nodemailer with Gmail SMTP
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // your Gmail
//         pass: process.env.EMAIL_PASS, // app password
//       },
//     })

//     // Send mail
//     await transporter.sendMail({
//       from: `"Job Portal" <${process.env.EMAIL_USER}>`,
//       to: "chingarihub@gmail.com",
//       subject: `New Job Application - ${name}`,
//       text: `
//         Name: ${name}
//         Email: ${email}
//         Phone: ${phone}
//       `,
//       attachments: [
//         {
//           filename: resume.name,
//           content: buffer,
//         },
//       ],
//     })

//     return NextResponse.json({ success: true, message: "Application submitted successfully!" })
//   } catch (err) {
//     console.error("Email error:", err)
//     return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
//   }
// }
