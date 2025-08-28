"use client";

import { useState } from "react";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    onSend(v);
    setValue("");
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        placeholder="What would you like to ask?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        aria-label="Chat input"
      />
      <button
        className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        disabled={disabled || value.trim() === ""}
        type="submit"
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
}
