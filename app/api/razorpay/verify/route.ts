// app/api/razorpay/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, enrollmentData } = body;

    // compute expected signature
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Signature valid -> create enrollment in DB (or call your existing /api/enrollments logic)
    // Replace the following with your DB or model code:
    // const saved = await createEnrollmentInDB({ ...enrollmentData, paymentId: razorpay_payment_id, orderId: razorpay_order_id });

    // Example: if you already have an API route /api/enrollments that accepts POST,
    // you can call it internally (server-side) or directly call your DB model.
    // const enrollRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/enrollments`, { ... });

    // For demo:
    const saved = { id: `enr_${Date.now()}`, ...enrollmentData };

    return NextResponse.json({ success: true, enrollment: saved });
  } catch (err: any) {
    console.error("verify error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}