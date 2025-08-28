"use client";

import { useState } from "react";
import ChatMessage, { ChatMsg } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { chatOnce } from "@/lib/api";
import { nanoid } from "nanoid";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: nanoid(), role: "assistant", text: "Hi! How may I assist you today?" },
  ]);
  const [loading, setLoading] = useState(false);

  async function handleSend(text: string) {
    if (!text.trim()) return;
    const you: ChatMsg = { id: nanoid(), role: "user", text };
    setMessages((m) => [...m, you]);
    setLoading(true);
    try {
      const reply = await chatOnce(text);
      const bot: ChatMsg = {
        id: nanoid(),
        role: "assistant",
        text: reply || "(no reply)",
      };
      setMessages((m) => [...m, bot]);
    } catch (_err: unknown) {
      const bot: ChatMsg = {
        id: nanoid(),
        role: "assistant",
        text: "Error contacting local LLM. Check your phone API address.",
      };
      setMessages((m) => [...m, bot]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col gap-4 max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Chat</h1>

      <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 bg-gray-50 p-4 rounded-xl shadow-inner">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-2 select-none bg-gray-100">
              <Skeleton height={20} width={130} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </section>
  );
}
