// app/library/page.tsx
"use client";

import { useState } from "react";
import PluginCard, { Plugin } from "@/components/PluginCard";
import { nanoid } from "nanoid";

export default function LibraryPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: nanoid(),
      name: "Aim Assist Analyzer",
      version: "0.1.0",
      enabled: true,
      description: "Extracts recoil/aim metrics from gameplay events.",
    },
    {
      id: nanoid(),
      name: "Match Strategy Advisor",
      version: "0.2.3",
      enabled: false,
      description: "Suggests strategies based on opponent patterns.",
    },
  ]);

  function toggle(id: string, enabled: boolean) {
    setPlugins((list) =>
      list.map((p) => (p.id === id ? { ...p, enabled } : p))
    );
  }

  function addPlugin() {
    setPlugins((list) => [
      ...list,
      {
        id: nanoid(),
        name: `New Plugin ${list.length + 1}`,
        version: "0.0.1",
        enabled: false,
      },
    ]);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Library</h1>
        <button
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white"
          onClick={addPlugin}
        >
          Add Plugin
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {plugins.map((p) => (
          <PluginCard key={p.id} plugin={p} onToggle={toggle} />
        ))}
      </div>
    </section>
  );
}
