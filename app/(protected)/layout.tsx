"use client";

import { useAuth } from "@/app/context/AuthContext";
import LoginRequired from "@/components/LoginRequired";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();

  if (loading) return null;
  if (!user) return <LoginRequired />;

  return <>{children}</>;
}
