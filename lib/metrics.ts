export type MetricPoint = {
  latency: number;
  errors: number;
  availability: number;
  timestamp: number;
};

export type RawMetric = { latencyMs: number; statusCode: number; availability: number; createdAt: string };

export type ServiceItem = {
  id: number;
  name: string;
  url: string;
  lastLatencyMs?: number | null;
  lastStatusCode?: number | null;
  lastAvailability?: number | null;
};

export const availabilityPercent = (availability: number) => availability <= 1 ? availability * 100 : availability;

export const RANGE_OPTIONS = [60, 60 * 24, 60 * 24 * 7] as const;

export function toChartData(metrics: { latencyMs?: number; statusCode?: number; availability?: number; createdAt?: string }[]): MetricPoint[] {
  return metrics.map((m) => ({
    latency: m.latencyMs ?? 0,
    errors: (m.statusCode ?? 200) >= 400 ? 1 : 0,
    availability: availabilityPercent(m.availability ?? 0),
    timestamp: m.createdAt ? new Date(m.createdAt).getTime() : 0,
  }));
}

export function sortMetricsByCreatedAt<T extends { createdAt?: string }>(metrics: T[]): T[] {
  return [...metrics].sort((left, right) => {
    const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
    return leftTime - rightTime;
  });
}

export function downsampleMetrics<T>(metrics: T[], maxPoints = 300): T[] {
  if (metrics.length <= maxPoints) return metrics;
  if (maxPoints <= 1) return metrics.slice(0, 1);

  return Array.from({ length: maxPoints }, (_, index) => {
    const sourceIndex = Math.round((index * (metrics.length - 1)) / (maxPoints - 1));
    return metrics[sourceIndex];
  });
}

export function formatChartTimestamp(value: number, includeSeconds = false) {
  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds ? { second: "2-digit" } : {}),
  });
}

export function filterMetricsByMinutes<T extends { createdAt?: string }>(metrics: T[], minutes: number): T[] {
  if (!metrics.length) return [];
  const cutoff = Date.now() - minutes * 60 * 1000;
  return metrics.filter((metric) => {
    const value = metric.createdAt ? new Date(metric.createdAt).getTime() : 0;
    return value >= cutoff;
  });
}

export function avgLatency(metrics: MetricPoint[]) {
  if (!metrics.length) return 0;
  return metrics.reduce((s, m) => s + m.latency, 0) / metrics.length;
}

export function isAnomaly(metrics: { latencyMs: number }[]) {
  if (metrics.length < 2) return null;
  const recent = metrics.slice(0, Math.min(5, metrics.length));
  const recentAvg = recent.reduce((s, m) => s + m.latencyMs, 0) / recent.length;
  const histAvg = metrics.reduce((s, m) => s + m.latencyMs, 0) / metrics.length;
  if (recentAvg <= histAvg * 3) return null;
  return { latency: Math.round(recentAvg), rule: "recent > historical * 3" };
}
