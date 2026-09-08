"use client";

import { RANGE_OPTIONS } from "@/lib/metrics";

export default function RangeSelector({ value, onChange }: { value: number; onChange: (minutes: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {RANGE_OPTIONS.map((minutes) => (
        <button
          key={minutes}
          type="button"
          onClick={() => onChange(minutes)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
            value === minutes ? "bg-[#6366F1] text-white" : "bg-[#1E293B] text-[#CBD5E1] hover:bg-[#334155]"
          }`}
        >
          {minutes >= 60 * 24 * 7 ? "Last 7 days" : minutes >= 60 * 24 ? "Last 24 hours" : "Last 60 min"}
        </button>
      ))}
    </div>
  );
}
