"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ChatModal() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, input]);
    setInput("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">💬 Chat</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chat</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto border p-2 rounded-md">
          {messages.map((msg, idx) => (
            <div key={idx} className="p-2 bg-muted rounded-md">
              {msg}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-md p-2"
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
