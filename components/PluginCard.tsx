// components/PluginCard.tsx
export type Plugin = {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  description?: string;
};

export default function PluginCard({
  plugin,
  onToggle,
}: {
  plugin: Plugin;
  onToggle?: (id: string, enabled: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4 shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{plugin.name}</h3>
          <p className="text-xs text-gray-500">v{plugin.version}</p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={plugin.enabled}
            onChange={(e) => onToggle?.(plugin.id, e.target.checked)}
          />
          <span>{plugin.enabled ? "Enabled" : "Disabled"}</span>
        </label>
      </div>
      {plugin.description && (
        <p className="mt-2 text-sm text-gray-700">{plugin.description}</p>
      )}
    </div>
  );
}
