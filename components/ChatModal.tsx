"use client";

import { useState } from "react";
import ChatInput from "@/components/ChatInput";
import ChatMessage, { ChatMsg } from "@/components/ChatMessage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ChatModal() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      const botMsg: ChatMsg = {
        id: generateId(),
        text: data.response,
        role: "assistant",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (_error: unknown) {
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
    <div className="flex flex-col max-w-lg mx-auto p-4 border rounded-md shadow-md bg-white">
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto mb-3 bg-gray-50 p-4 rounded-lg">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-gray-100 select-none">
              <Skeleton height={20} width={140} />
            </div>
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
