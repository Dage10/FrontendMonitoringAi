import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { formatChartTimestamp } from "@/lib/metrics";
import type { MetricPoint } from "@/lib/metrics";

export default function LatencyChart({ data }: { data: MetricPoint[] }) {
  return (
    <div className="bg-[#1E293B] p-6 rounded-lg min-w-0 w-full">
      <div className="w-full h-48 md:h-56 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={["dataMin", "dataMax"]}
              minTickGap={28}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => formatChartTimestamp(Number(value))}
            />
            <YAxis />
            <Tooltip labelFormatter={(value) => formatChartTimestamp(Number(value), true)} />
            <Line type="monotone" dataKey="latency" stroke="#6366F1" strokeWidth={2} dot={false} activeDot={{ r: 4}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
