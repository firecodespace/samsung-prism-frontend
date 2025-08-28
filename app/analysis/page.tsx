// app/analysis/page.tsx
"use client";

import { useEffect, useState } from "react";
import Graph, { Point } from "@/components/Graph";
// Make sure fetchPerformance is exported from "@/lib/api"
// If it's a default export, use:
// import fetchPerformance from "@/lib/api";
// Otherwise, ensure the named export exists in the module.
import { fetchPerformance } from "@/lib/api";

export default function AnalysisPage() {
  const [series, setSeries] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Replace "player-1" with actual player id if needed
        const data = await fetchPerformance("player-1");
        setSeries(data.length ? data : demoData());
      } catch {
        setSeries(demoData()); // fallback demo
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Game Analysis</h1>
      <p className="text-gray-700">
        Slide-worthy responsive chart of your performance. (Data fetched from
        your phone’s API via proxy.)
      </p>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading ? <p>Loading…</p> : <Graph data={series} />}
      </div>
    </section>
  );
}

function demoData(): Point[] {
  // nice smooth demo curve
  return Array.from({ length: 24 }).map((_, i) => ({
    t: i,
    v: Math.max(0, Math.round(40 + 30 * Math.sin(i / 3) + i * 1.2)),
  }));
}
