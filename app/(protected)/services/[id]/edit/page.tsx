"use client";

import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api(`/services/${id}`).then((s: { name: string; url: string }) => {
      setName(s.name);
      setUrl(s.url);
    }).catch(() => setError("Unable to load service"));
  }, [id]);

  const submit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await api(`/services/${id}`, { method: "PUT", body: JSON.stringify({ name, url }) });
      router.push("/services");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="relative text-[#F8FAFC] min-h-screen">
        <Link href="/services" className="w-10 h-10 absolute top-10 left-4 cursor-pointer bg-[#6366F1] p-2 rounded-full text-[#F8FAFC]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div className="flex">
          <div className="flex flex-col w-full px-10 lg:px-8 pt-24 pb-10 gap-8 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-center h-auto gap-4 p-6 mx-auto max-w-md xl:max-w-6xl lg:max-w-6xl bg-[#334155] shadow-[0_4px_24px_rgba(0,0,0,0.25)] rounded-xl w-full">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[#F8FAFC]">Service Name</label>
                <input
                  className="bg-[#1E293B] text-[#F8FAFC] w-full p-2 border border-[#334155] rounded focus:border-[#6366F1] outline-none"
                  value={name}
                  required
                  maxLength={100}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[#F8FAFC]">URL</label>
                <input
                  className="bg-[#1E293B] text-[#F8FAFC] w-full p-2 border border-[#334155] rounded focus:border-[#6366F1] outline-none"
                  value={url}
                  required
                  type="url"
                  maxLength={500}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 w-full lg:pt-8">
                {error && <p className="text-sm text-[#F87171]" role="alert">{error}</p>}
                <button type="button" disabled={submitting} className="p-2 bg-[#6366F1] rounded text-[#F8FAFC] disabled:opacity-60" onClick={submit}>
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
