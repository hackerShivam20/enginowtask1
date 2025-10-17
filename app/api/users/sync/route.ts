// app/api/users/sync/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

/**
 * POST /api/users/sync
 * Syncs Clerk user info with MongoDB (create if missing, update if exists).
 */
export async function POST(req: Request) {
  try {
    const authUser = await currentUser(); // server-verified Clerk user

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ensure DB connection
    await connectDB();

    // data coming from Clerk user object
    const data = {
      clerkId: authUser.id,
      email:
        authUser.primaryEmailAddress?.emailAddress ||
        authUser.emailAddresses?.[0]?.emailAddress,
      firstName: authUser.firstName ?? authUser.firstName ?? "",
      lastName: authUser.lastName ?? "",
      avatarUrl: authUser.imageUrl ?? "",
    };

    const user = await User.findOneAndUpdate(
      { clerkId: data.clerkId },
      { $set: data },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
// models/User.ts