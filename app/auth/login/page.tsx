"use client";

import { useState } from "react";
import { login as loginApi } from "@/lib/auth";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }
    setSubmitting(true);
    try {
      const user = await loginApi(username, password);
      login(user);
      router.push("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
        <Link href="/" className="w-10 h-10 absolute top-4 left-4 cursor-pointer bg-[#6366F1] p-2 rounded-full text-[#F8FAFC]" onClick={() => router.push("/")}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>

         <div className="min-h-screen flex flex-col lg:flex-row bg-[#0F172A]">
            <div className="hidden lg:flex lg:flex-col  lg:justify-center items-center w-full xl:max-w-7xl bg-[#1E293B] py-10">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="500"
                height="500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F8FAFC"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-6"
                >
                <rect x="16" y="16" width="6" height="6" rx="1" />
                <rect x="2" y="16" width="6" height="6" rx="1" />
                <rect x="9" y="2" width="6" height="6" rx="1" />
                <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
                <path d="M12 12V8" />
                </svg>
            </div>
            <div className="flex flex-col gap-6 px-8 py-16 lg:px-24 w-full">
            
                <h1 className="text-4xl lg:text-6xl text-[#F8FAFC] font-semibold">
                    Sign in
                </h1>

                <h3 className="text-lg text-[#94A3B8]">
                    New to Ai Monitoring System? <Link href="/auth/register" className="text-[#6366F1] hover:underline">
                        Create an account
                    </Link>
                </h3>

                <form className="flex flex-col gap-4 text-[#CBD5E1]" onSubmit={submit}>
                    <div className="flex flex-col gap-2 w-full">
                      <label>Username</label>
                      <input type="text" name="username" value={username} onChange={e => setU(e.target.value)} className="bg-[#1E293B] text-[#F8FAFC] max-w-md p-2 border border-[#334155] rounded focus:border-[#6366F1] outline-none" />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label>Password</label>
                      <input type="password" name="password" value={password} onChange={e => setP(e.target.value)} className="bg-[#1E293B] text-[#F8FAFC] max-w-md p-2 border border-[#334155] rounded focus:border-[#6366F1] outline-none" />
                    </div>
                    {error && <p className="max-w-md text-[#F87171]" role="alert">{error}</p>}
                    <button type="submit" disabled={submitting} className="bg-[#6366F1] text-[#F8FAFC] max-w-md p-2 rounded hover:bg-[#6366F1]/80 disabled:opacity-60">
                      {submitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>

            </div>
        </div>
        
    </>
  );
}
