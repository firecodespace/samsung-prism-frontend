import React from "react";

export type ChatMsg = { id: string; text: string; role: "user" | "assistant" };

export default function ChatMessage({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-6 break-words
          ${isUser ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}
        `}
        role="article"
        aria-label={isUser ? "User message" : "Assistant message"}
      >
        {msg.text}
      </div>
    </div>
  );
}
