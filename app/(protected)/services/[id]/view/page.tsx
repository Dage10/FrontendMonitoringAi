"use client";

import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { availabilityPercent, toChartData, isAnomaly, filterMetricsByMinutes, sortMetricsByCreatedAt, downsampleMetrics, type RawMetric } from "@/lib/metrics";
import Header from "@/components/Header";
import LatencyChart from "@/components/LatencyChart";
import ErrorsChart from "@/components/ErrorsChart";
import AvailabilityChart from "@/components/AvailabilityChart";
import RangeSelector from "@/components/RangeSelector";
import Link from "next/link";

type Service = { name: string; url: string; lastLatencyMs?: number | null; lastStatusCode?: number | null; lastAvailability?: number | null };

const statusText = (code: number) => {
  if (code >= 200 && code < 300) return `${code} OK`;
  if (code >= 300 && code < 400) return `${code} Redirect`;
  if (code >= 400 && code < 500) return `${code} Client Error`;
  if (code >= 500) return `${code} Server Error`;
  return `${code}`;
};

export default function ViewServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [rawMetrics, setRawMetrics] = useState<RawMetric[]>([]);
  const [rangeMinutes, setRangeMinutes] = useState<number>(60);

  useEffect(() => {
    api(`/services/${id}`).then(setService).catch(() => setService(null)).finally(() => setLoading(false));
    api(`/metrics/service/${id}?minutes=${rangeMinutes}`).then(setRawMetrics).catch(() => setRawMetrics([]));
  }, [id, rangeMinutes]);

  const filteredMetrics = sortMetricsByCreatedAt(filterMetricsByMinutes(rawMetrics, rangeMinutes));
  const metrics = toChartData(downsampleMetrics(filteredMetrics));
  const latest = filteredMetrics[filteredMetrics.length - 1] ?? null;
  const anomaly = isAnomaly([...filteredMetrics].reverse());

  if (loading) return <><Header /><p className="text-[#F8FAFC] p-8">Loading...</p></>;
  if (!service) return <><Header /><p className="text-[#F8FAFC] p-8">Service not found.</p></>;

  return (
    <>
      <Header />
      <div className="relative text-[#F8FAFC] min-h-screen min-w-0">
        <Link href="/services" className="w-10 h-10 absolute top-10 left-4 cursor-pointer bg-[#6366F1] p-2 rounded-full text-[#F8FAFC]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>

        <div className="flex min-w-0">
          <div className="flex flex-col w-full px-10 lg:px-8 pt-24 pb-10 gap-8 max-w-7xl mx-auto min-w-0">
            <div className="bg-[#334155] p-8 rounded-xl w-full shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
              <div className="flex flex-col lg:flex-row gap-4 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[#F8FAFC]">Service Name</label>
                  <p className="bg-[#1E293B] text-[#F8FAFC] w-full p-2 rounded truncate" title={service.name}>{service.name}</p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[#F8FAFC]">Url</label>
                  <p className="bg-[#1E293B] text-[#F8FAFC] w-full p-2 rounded truncate" title={service.url}>{service.url}</p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[#F8FAFC]">State</label>
                  <p className="bg-[#1E293B] text-[#F8FAFC] w-full p-2 rounded">
                    {!latest || latest.statusCode < 400 ? "Active" : "Error"}
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[#F8FAFC]">Last latency</label>
                  <p className="bg-[#1E293B] text-[#F8FAFC] w-full p-2 rounded">
                    {latest?.latencyMs ?? service.lastLatencyMs ?? "—"} ms
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-lg font-semibold">Kpis:</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#334155] p-4 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                  <p className="text-sm opacity-80">Current latency</p>
                  <p className="text-xl font-bold">{latest?.latencyMs ?? "—"}ms</p>
                </div>
                <div className="bg-[#334155] p-4 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                  <p className="text-sm opacity-80">Status code</p>
                  <p className="text-xl font-bold">{latest ? statusText(latest.statusCode) : "—"}</p>
                </div>
                <div className="bg-[#334155] p-4 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                  <p className="text-sm opacity-80">Availability</p>
                  <p className="text-xl font-bold">{latest ? `${availabilityPercent(latest.availability).toFixed(1)}%` : "—"}</p>
                </div>
                <div className="bg-[#334155] p-4 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                  <p className="text-sm opacity-80">Errors</p>
                  <p className="text-xl font-bold">
                    {latest ? (latest.statusCode >= 400 ? "1" : "0") : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
              <div className="flex flex-col gap-4 min-w-0">
                <p className="text-lg font-semibold">Historic metrics:</p>
                <RangeSelector value={rangeMinutes} onChange={setRangeMinutes} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                  <div className="bg-[#334155] p-6 rounded-xl min-w-0 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                    <p className="text-lg font-semibold mb-2">Latency (Historic)</p>
                    <LatencyChart data={metrics} />
                  </div>
                  <div className="bg-[#334155] p-6 rounded-xl min-w-0 gap-4 flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                    <p className="text-lg font-semibold mb-2">Errors & Availability (Historic)</p>
                    <ErrorsChart data={metrics} />
                    <AvailabilityChart data={metrics} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 min-w-0">
                <p className="text-lg font-semibold">Latency:</p>
                <RangeSelector value={rangeMinutes} onChange={setRangeMinutes} />
                <div className="bg-[#334155] p-6 rounded-xl w-full min-w-0 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                  <LatencyChart data={metrics} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
              <div className="flex flex-col gap-4 min-w-0">
                <p className="text-lg font-semibold">Errors/Disponibility:</p>
                <RangeSelector value={rangeMinutes} onChange={setRangeMinutes} />
                <div className="bg-[#334155] p-6 rounded-xl w-full min-w-0 gap-4 flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                  <ErrorsChart data={metrics} />
                  <AvailabilityChart data={metrics} />
                </div>
              </div>
              <div className="flex flex-col gap-4 min-w-0">
                <p className="text-lg font-semibold">Anomalies:</p>
                <div
                  className="bg-[#334155] p-6 rounded-xl w-full min-w-0 shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
                  style={anomaly ? { boxShadow: "0 0 24px rgba(245,158,11,0.45)" } : undefined}
                >
                  {anomaly ? (
                    <>
                      <p className="text-lg font-semibold mb-4 flex items-center gap-2">⚠️ Latency spike detected</p>
                      <div className="bg-[#1E293B] p-4 rounded-xl flex flex-col gap-2">
                        <p className="text-sm opacity-80">Time</p>
                        <p className="text-base font-bold">{latest ? new Date(latest.createdAt).toLocaleTimeString() : "—"}</p>
                        <p className="text-sm opacity-80">Latency</p>
                        <p className="text-base font-bold">{anomaly.latency}ms</p>
                        <p className="text-sm opacity-80">Rule</p>
                        <p className="text-base font-bold">{anomaly.rule}</p>
                        <p className="text-sm opacity-80">Status</p>
                        <p className="text-base font-bold text-[#FBBF24]">anomaly</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-[#94A3B8]">No anomalies detected.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
