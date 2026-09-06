"use client";

import { useState } from "react";
import { register as registerApi } from "@/lib/auth";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [username, setU] = useState("");
  const [email, setE] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await registerApi(username, email, password);
      login(user);
      router.push("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Registration failed");
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
                    Sign up
                </h1>

                <h3 className="text-lg text-[#94A3B8]">
                    Already have an account? <Link href="/auth/login" className="text-[#6366F1] hover:underline">
                        Sign in
                    </Link>
                </h3>

                <form className="flex flex-col gap-4 text-[#CBD5E1]" onSubmit={submit}>
                    <div className="flex flex-col gap-2">
                      <label>Username</label>
                      <input type="text" value={username} onChange={e => setU(e.target.value)} className="bg-[#1E293B] text-[#F8FAFC] max-w-md p-2 border border-[#334155] rounded focus:border-[#6366F1] outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label>Email</label>
                      <input type="email" value={email} onChange={e => setE(e.target.value)} className="bg-[#1E293B] text-[#F8FAFC] max-w-md p-2 border border-[#334155] rounded focus:border-[#6366F1] outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label>Password</label>
                      <input type="password" value={password} onChange={e => setP(e.target.value)} className="bg-[#1E293B] text-[#F8FAFC] max-w-md p-2 border border-[#334155] rounded focus:border-[#6366F1] outline-none" />
                    </div>
                    {error && <p className="max-w-md text-[#F87171]" role="alert">{error}</p>}
                    <button type="submit" disabled={submitting} className="bg-[#6366F1] text-[#F8FAFC] max-w-md p-2 rounded hover:bg-[#6366F1]/80 disabled:opacity-60">
                      {submitting ? "Signing up..." : "Sign up"}
                    </button>
                </form>

            </div>
        </div>
        
    </>
  );
}
