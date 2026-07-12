"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, loading, roleHome } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? roleHome[user.role] || "/login" : "/login");
  }, [user, loading, router, roleHome]);

  return (
    <div className="min-h-screen flex items-center justify-center text-muted text-sm">
      Loading…
    </div>
  );
}
