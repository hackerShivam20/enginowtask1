// app/api/razorpay/verify/route.ts
import { NextResponse } from "next/server"
import crypto from "crypto"
import connectDB from "@/lib/mongodb"
import Enrollment from "@/models/Enrollment"
import { currentUser } from "@clerk/nextjs/server"

/**
 * POST /api/razorpay/verify
 * Called after Razorpay payment success
 */
export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      programId,
      formData,
      course,
      amount,
    } = body

    // ✅ Verify logged-in user
    const authUser = await currentUser()
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    // ✅ Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      )
    }

    // ✅ Generate a unique enrollmentId
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    const enrollmentId = `ENR${timestamp}${random}`

    // ✅ Create or update enrollment in MongoDB
    const enrollment = await Enrollment.findOneAndUpdate(
      {
        razorpayOrderId: razorpay_order_id, // prevent duplicate saves
      },
      {
        $set: {
          userId: authUser.id,
          programId,
          enrollmentId,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          paymentStatus: "completed",
          status: "confirmed",
          enrollmentDate: new Date(),
          ...formData, // all user-provided form fields
        },
      },
      { upsert: true, new: true }
    )

    return NextResponse.json({
      success: true,
      message: "✅ Payment verified & enrollment saved successfully",
      enrollment,
    })
  } catch (error) {
    console.error("Razorpay verification error:", error)
    return NextResponse.json(
      { success: false, message: "Server error", error: String(error) },
      { status: 500 }
    )
  }
}