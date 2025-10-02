// app/api/razorpay/webhook/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  if (expected !== signature) return new Response("Invalid signature", { status: 400 });

  const event = JSON.parse(payload);
  // handle event.event (e.g., payment.captured) and update/create enrollment in DB
  return NextResponse.json({ ok: true });
}