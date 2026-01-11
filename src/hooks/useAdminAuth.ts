"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function useAdminAuth() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please sign in as admin");
      router.push("/admin/login");
      return;
    }

    if (!isPending && session?.user && session.user.role !== "admin") {
      toast.error("Access denied. Admin credentials required.");
      router.push("/");
    }
  }, [session, isPending, router]);

  return { session, isPending };
}
