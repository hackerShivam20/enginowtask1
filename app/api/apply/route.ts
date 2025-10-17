import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// NOTE: do NOT set `export const runtime = "edge"` in this file — nodemailer needs Node runtime.

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const education = String(formData.get("education") || "");
    const experience = String(formData.get("experience") || "");
    const linkedin = String(formData.get("linkedin") || "");
    const portfolio = String(formData.get("portfolio") || "");
    const coverLetter = String(formData.get("coverLetter") || "");
    const jobId = String(formData.get("jobId") || "");
    const jobTitle = String(formData.get("jobTitle") || "");

    const resume = formData.get("resume"); // File/Blob

    // Build attachments only if file present
    const attachments: any[] = [];
    if (resume instanceof File) {
      const ab = await resume.arrayBuffer();
      const buffer = Buffer.from(ab);
      const filename = (resume as File).name || "resume";
      attachments.push({
        filename,
        content: buffer,
        contentType: (resume as File).type || "application/octet-stream",
      });
    }

    // Create transporter (explicit SMTP settings tend to be more reliable)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // change .env.local file according to app key or mail id
        user: process.env.GMAIL_USER || "your-email@gmail.com",
        pass: process.env.GMAIL_PASS || "your-app-password",
      },
    });

    const mailText = [
      `Job: ${jobTitle} (ID: ${jobId})`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Education: ${education}`,
      `Experience: ${experience}`,
      `LinkedIn: ${linkedin}`,
      `Portfolio: ${portfolio}`,
      `Cover Letter:\n${coverLetter}`,
    ].join("\n\n");

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "chingarihub@gmail.com",
      subject: `New Job Application - ${name || "Unknown"} (${jobTitle})`,
      text: mailText,
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
























// import nodemailer from "nodemailer";
// import { NextResponse } from "next/server";

// // NOTE: do NOT set `export const runtime = "edge"` in this file — nodemailer needs Node runtime.

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const name = formData.get("name") || "";
//     const email = formData.get("email") || "";
//     const phone = formData.get("phone") || "";
//     const resume = formData.get("resume"); // File/Blob

//     // Build attachments only if file present
//     const attachments = [];
//     if (resume instanceof File) {
//       const ab = await resume.arrayBuffer();
//       const buffer = Buffer.from(ab);
//       const filename = resume.name || "resume";
//       attachments.push({
//         filename,
//         content: buffer,
//         contentType: resume.type || "application/octet-stream",
//       });
//     }

//     // Create transporter (explicit SMTP settings tend to be more reliable)
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         // change .env.local file according to app key or mail id
//         user: process.env.GMAIL_USER || "your-email@gmail.com",
//         pass: process.env.GMAIL_PASS || "your-app-password",
//       },
//     });

//     const mailOptions = {
//       from: process.env.GMAIL_USER,
//       to: "chingarihub@gmail.com",
//       subject: `New Job Application - ${name || "Unknown"}`,
//       text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`,
//       attachments,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", info?.messageId);

//     return NextResponse.json({ success: true, message: "Application sent." });
//   } catch (error) {
//     console.error("Apply API error:", error);
//     return NextResponse.json(
//       { success: false, message: "Error sending application", error: String(error) },
//       { status: 500 }
//     );
//   }
// }















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
