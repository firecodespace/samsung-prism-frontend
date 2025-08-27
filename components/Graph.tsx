// components/Graph.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export type Point = { t: number; v: number };

export default function Graph({ data }: { data: Point[] }) {
  return (
    <div className="w-full h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="t" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="v" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
