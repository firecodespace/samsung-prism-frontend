// app/page.tsx

import Taskbar from "@/components/Taskbar";

export default function Home() {
  return (
    <div className="flex flex-col h-full min-h-0 relative">
      {/* Top Chat Taskbar - Fixed positioning to avoid overlap */}
      <div className="relative z-20 mb-4">
        <Taskbar />
      </div>

      {/* Main content - Takes remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-32 min-h-0">
        <h2 className="text-2xl font-semibold">🎮 Game Dashboard</h2>

        {/* Game Analysis section - Responsive sizing */}
        <div className="w-full max-w-md flex-1 max-h-80 border rounded-lg flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-lg">
          📊 Game Analysis Graph
        </div>
      </div>
    </div>
  );
}