// app/api/razorpay/create-order/route.ts
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    // const body = await request.json();
    // amount must be in paise (smallest currency unit)
    // const { amount /* integer in paise */, currency = "INR", receipt } = body;

    // const options = {
    //   amount: Math.round(amount), // in paise
    //   currency,
    //   receipt: receipt || `rcpt_${Date.now()}`,
    //   payment_capture: 1, // auto-capture (set to 0 if you want manual capture)
    // };

    // const order = await razorpay.orders.create(options);
    const body = await request.json();
    const { amount } = body; // ✅ this comes from frontend (program.price * 100)

    if (!amount) {
      return NextResponse.json({ success: false, error: "Amount is required" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: "receipt_" + Math.random().toString(36).substring(7),
    });
    // return NextResponse.json({ success: true, order });
    return NextResponse.json({orderId: order.id}, { status: 200 });
  } catch (err: any) {
    console.error("create-order error:", err);
    return NextResponse.json({ success: false, error: "Error creating order" }, { status: 500 });
  }
}
// Note: Ensure that RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in your environment variables