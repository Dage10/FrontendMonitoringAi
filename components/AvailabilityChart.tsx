import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { MetricPoint } from "@/lib/metrics";

export default function AvailabilityChart({ data }: { data: MetricPoint[] }) {
  return (
    <div className="bg-[#1E293B] p-6 rounded-lg min-w-0 w-full">
      <div className="w-full h-48 md:h-56 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="timestamp" minTickGap={28} tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Area type="monotone" dataKey="availability" stroke="#14B8A6" fill="rgba(20,184,166,0.25)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
