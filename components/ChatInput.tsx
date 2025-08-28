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

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (!v) return;
        onSend(v);
        setValue("");
      }}
    >
      <input
        className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        placeholder="What would you like to ask?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <button
        className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        disabled={disabled}
        type="submit"
      >
        Send
      </button>
    </form>
  );
}
