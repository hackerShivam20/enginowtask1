// models/User.ts
import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  clerkId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    avatarUrl: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;