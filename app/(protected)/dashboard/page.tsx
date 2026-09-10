"use client";

import { useEffect, useState } from "react";
import { connectSSE } from "@/lib/sse";
import { api } from "@/lib/api";
import { toChartData, avgLatency, availabilityPercent, filterMetricsByMinutes } from "@/lib/metrics";
import LatencyChart from "@/components/LatencyChart";
import Header from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import ErrorsChart from "@/components/ErrorsChart";
import AvailabilityChart from "@/components/AvailabilityChart";
import RangeSelector from "@/components/RangeSelector";
import Link from "next/link";

type Service = { id: number; lastStatusCode?: number | null };
type RawMetric = { latencyMs: number; statusCode: number; availability: number; createdAt: string };

export default function Dashboard() {
  const [metrics, setMetrics] = useState<ReturnType<typeof toChartData>>([]);
  const [alerts, setAlerts] = useState<{ message: string; time: string; service: string }[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [lastUpdate, setLastUpdate] = useState("");
  const [rangeMinutes, setRangeMinutes] = useState<number>(60);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api("/services").then(setServices).catch(() => setServices([]));
  }, []);

  useEffect(() => {
    const loadHistoricalMetrics = async () => {
      if (services.length === 0) return;
      try {
        const allMetrics: RawMetric[] = [];
        for (const service of services) {
          const serviceMetrics = await api<RawMetric[]>(`/metrics/service/${service.id}?minutes=${rangeMinutes}`);
          allMetrics.push(...serviceMetrics);
        }
        if (allMetrics.length > 0) {
          const filtered = filterMetricsByMinutes([...allMetrics], rangeMinutes);
          setMetrics(toChartData([...filtered].reverse().slice(-50)));
          setLastUpdate(new Date().toLocaleTimeString());
        } else {
          setMetrics([]);
        }
      } catch {
        setMetrics([]);
      }
    };

    loadHistoricalMetrics();
  }, [services, rangeMinutes]);

  useEffect(() => {
    const close = connectSSE((event, data) => {
      if (event === "metric") {
        const point = data as RawMetric;
        const mapped = {
          latency: point.latencyMs ?? 0,
          errors: (point.statusCode ?? 200) >= 400 ? 1 : 0,
          availability: availabilityPercent(point.availability ?? 0),
          timestamp: new Date(point.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMetrics((prev) => [...prev.slice(-49), mapped]);
        setLastUpdate(new Date().toLocaleTimeString());
      }
      if (event === "alert") {
        const alertMsg = String(data);
        const serviceMatch = alertMsg.match(/service:\s*(.+)/);
        const serviceName = serviceMatch?.[1] || "Unknown";
        setAlerts((prev) => [...prev.slice(-9), { message: alertMsg, time: new Date().toLocaleTimeString(), service: serviceName }]);
      }
    });
    return close;
  }, [rangeMinutes]);

  const activeCount = services.filter((s) => !s.lastStatusCode || s.lastStatusCode < 400).length;

  return (
    <>
      <Header onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <div className="flex-1 flex min-w-0 text-[#F8FAFC]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-col min-w-0 w-full">
          <div className="flex justify-start lg:justify-end px-8 pt-8">
            <Link href="/services/create" className="bg-[#6366F1] p-2 rounded-lg text-sm font-medium hover:opacity-90">
              Add new service +
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 text-white min-w-0">
            <div className="bg-[#334155] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.25)] rounded-xl w-full lg:col-span-1">
              <h1 className="text-xl font-semibold mb-6">Summary</h1>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-[#CBD5E1] text-sm">Services monitored</p>
                  <p className="text-2xl font-bold">{services.length}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[#CBD5E1] text-sm">Active</p>
                  <p className="text-2xl font-bold text-[#10B981]">{activeCount}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[#CBD5E1] text-sm">Anomalies</p>
                  <p className="text-2xl font-bold text-[#FBBF24]">{alerts.length}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[#CBD5E1] text-sm">Avg latency</p>
                  <p className="text-2xl font-bold">{avgLatency(metrics).toFixed(0)}ms</p>
                </div>
              </div>
            </div>
            <div className="bg-[#334155] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.25)] rounded-xl w-full lg:col-span-2 min-w-0">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-semibold mb-1">Metrics (Real-time)</h2>
                  <p className="text-sm text-[#CBD5E1]">Updated via SSE every 30 seconds</p>
                </div>
                <RangeSelector value={rangeMinutes} onChange={setRangeMinutes} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                  <div className="flex flex-col gap-2 min-w-0">
                    <h3 className="text-sm font-medium text-[#CBD5E1]">Latency (ms)</h3>
                    <LatencyChart data={metrics} />
                  </div>
                  <div className="flex flex-col gap-2 min-w-0">
                    <h3 className="text-sm font-medium text-[#CBD5E1]">Errors (per check)</h3>
                    <ErrorsChart data={metrics} />
                  </div>
                </div>
                <p className="text-xs text-[#94A3B8]">Last update: {lastUpdate || "—"}</p>
              </div>
            </div>
            <div className="bg-[#334155] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.25)] rounded-xl w-full min-w-0">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Availability</h2>
                  <p className="text-sm text-[#CBD5E1]">{metrics.length ? (metrics.reduce((s, m) => s + m.availability, 0) / metrics.length).toFixed(1) : 0}%</p>
                </div>
                <RangeSelector value={rangeMinutes} onChange={setRangeMinutes} />
                <AvailabilityChart data={metrics} />
                <p className="text-xs text-[#94A3B8]">Last update: {lastUpdate || "—"}</p>
              </div>
            </div>
            <div className="bg-[#334155] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.25)] rounded-xl w-full">
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Anomalies</h2>
                {alerts.length === 0 ? (
                  <p className="text-[#94A3B8] text-sm">No anomalies detected</p>
                ) : (
                  <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
                    {alerts.map((alert, idx) => (
                      <div key={idx} className="border-l-4 border-[#FBBF24] bg-[#1E293B] p-3 rounded">
                        <p className="text-sm font-medium">{alert.service}</p>
                        <p className="text-xs text-[#CBD5E1] mt-1">{alert.message}</p>
                        <p className="text-xs text-[#94A3B8] mt-1">{alert.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
