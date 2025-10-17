// components/ClerkSyncUser.tsx
"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

/**
 * Runs on client after user signs in — triggers /api/users/sync once.
 * Idempotent: safe to call multiple times.
 */
export default function ClerkSyncUser() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;

    fetch("/api/users/sync", { method: "POST" }).catch((err) =>
      console.error("Failed to sync Clerk user:", err)
    );
  }, [isSignedIn]);

  return null;
}