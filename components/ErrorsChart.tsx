import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { MetricPoint } from "@/lib/metrics";

export default function ErrorsChart({ data }: { data: MetricPoint[] }) {
  return (
    <div className="bg-[#1E293B] rounded-lg min-w-0 w-full p-6">
      <div className="w-full h-48 md:h-56 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="timestamp" minTickGap={28} tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="errors" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
