// app/chatbot/page.tsx
"use client";

import { useState } from "react";
import ChatMessage, { ChatMsg } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { chatOnce } from "@/lib/api";
import { nanoid } from "nanoid";

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: nanoid(), role: "assistant", text: "Hi! How may I assist you today?" },
  ]);
  const [loading, setLoading] = useState(false);

  async function handleSend(text: string) {
    const you: ChatMsg = { id: nanoid(), role: "user", text };
    setMessages((m) => [...m, you]);
    setLoading(true);
    try {
      const reply = await chatOnce(text);
      const bot: ChatMsg = { id: nanoid(), role: "assistant", text: reply || "(no reply)" };
      setMessages((m) => [...m, bot]);
    } catch (err: any) {
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
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Chat</h1>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}
        </div>

        <div className="mt-4">
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      </div>
    </section>
  );
}
