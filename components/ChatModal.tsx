"use client";

import { useState } from "react";
import ChatInput from "@/components/ChatInput";
import ChatMessage, { ChatMsg } from "@/components/ChatMessage";

export default function ChatModal() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [adapter, setAdapter] = useState<string | null>(null); // Selected adapter

  // Generate simple unique IDs for messages
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSend = async (input: string) => {
    if (!input.trim()) return;

    const userMsg: ChatMsg = { id: generateId(), text: input, role: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/proxy?path=/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, adapter }),
      });
      const data = await res.json();

      const botMsg: ChatMsg = {
        id: generateId(),
        text: data.response,
        role: "assistant",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMsg = {
        id: generateId(),
        text: "Error: failed to get response from AI backend.",
        role: "assistant",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto p-4 border rounded-md">
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto mb-3 bg-gray-50 p-2">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
        {loading && <div className="italic text-gray-500">Assistant is typing...</div>}
      </div>

      {/* Optional: Adapter selection (expand later) */}
      {/* <select
        value={adapter || ""}
        onChange={(e) => setAdapter(e.target.value)}
        className="mb-2 border p-2 rounded"
      >
        <option value="">Base</option>
        <option value="personalization">Personalization</option>
        <option value="game_assist">Game Assist</option>
      </select> */}

      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
