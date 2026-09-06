"use client";

import { useRouter } from "next/navigation";

export default function LoginRequired() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-3xl gap-4 h-auto p-6 border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.25)] rounded-xl mt-20 text-[#F8FAFC]">
      <p>You must be logged in to view this page.</p>
      <button
        className="bg-[#6366F1] hover:bg-[#4F46E5] text-[#F8FAFC] font-medium py-2 px-4 rounded"
        onClick={() => router.push("/auth/login")}
      >
        Login
      </button>
    </div>
  );
}
