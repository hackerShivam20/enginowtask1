import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Enrollment from "@/models/Enrollment"

export async function GET() {
  try {
    const { userId } = await auth()
    console.log("👤 Clerk userId:", userId);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    console.log("✅ MongoDB connected, fetching enrollments...");

    const enrollments = await Enrollment.find({ userId }).sort({ createdAt: -1 })
    console.log("📚 Found enrollments:", enrollments.length);

    return NextResponse.json({
      success: true,
      data: enrollments,
    })
  } catch (error) {
    console.error("Error fetching user enrollments:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch enrollments" },
      { status: 500 }
    )
  }
}
