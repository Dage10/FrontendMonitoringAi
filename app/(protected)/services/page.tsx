"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import Service from "@/components/Service";
import Header from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

type ServiceItem = {
  id: number;
  name: string;
  url: string;
  lastLatencyMs?: number | null;
  lastStatusCode?: number | null;
};

const PAGE_SIZE = 3;

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api("/services").then(setServices).catch(() => setServices([]));
  }, []);

  const totalPages = Math.max(1, Math.ceil(services.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedServices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return services.slice(start, start + PAGE_SIZE);
  }, [services, currentPage]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setDeleting(id);
    try {
      await api(`/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <Header onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <div className="flex-1 flex min-w-0 text-[#F8FAFC]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col p-8 min-w-0 w-full">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h1 className="text-2xl">Your services</h1>
            <Link href="/services/create" className="lg:ml-auto bg-[#6366F1] p-2 rounded-lg text-sm font-medium hover:opacity-90">
              Add new service +
            </Link>
          </div>
          <div className="flex flex-col gap-4 w-full">
            {pagedServices.map((s) => (
              <Service
                key={s.id}
                name={s.name}
                url={s.url}
                active={!s.lastStatusCode || s.lastStatusCode < 400}
                latency={s.lastLatencyMs}
                onView={() => router.push(`/services/${s.id}/view`)}
                onEdit={() => router.push(`/services/${s.id}/edit`)}
                onDelete={() => handleDelete(s.id)}
                isDeleting={deleting === s.id}
              />
            ))}
            {!services.length && <p className="text-[#94A3B8]">No services yet.</p>}
          </div>
          {services.length > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-white/5">
              <p className="text-sm text-[#CBD5E1]">Page {currentPage} of {totalPages}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-[#1E293B] text-[#F8FAFC] disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-[#1E293B] text-[#F8FAFC] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
