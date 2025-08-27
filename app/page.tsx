import Taskbar from "@/components/Taskbar";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Top Chat Taskbar */}
      <Taskbar />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <h2 className="text-2xl font-semibold">🎮 Game Dashboard</h2>

        {/* Game Analysis section */}
        <div className="w-full max-w-md h-64 border rounded-lg flex items-center justify-center">
          📊 Game Analysis Graph
        </div>
      </div>
    </main>
  );
}
