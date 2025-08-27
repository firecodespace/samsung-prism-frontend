"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// type for messages
type Message = {
  from: "user" | "bot";
  text: string;
};

export default function Taskbar() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false); // toggle for chat popup

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { from: "user", text: input }];
    setMessages(newMessages);

    // fake bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "🤖 Bot response to: " + input },
      ]);
    }, 500);

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-background border-t flex flex-col items-center p-3 transition-all duration-300 z-40">
      {/* Logo / Title */}
      <div className="flex w-full justify-between items-center max-w-4xl">
        <h1 className="text-xl font-bold transition-all duration-300 hover:scale-105 hover:text-blue-600 cursor-default">
          ⚡ My AI Assistant
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen((prev) => !prev)}
          className="transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-blue-50 hover:border-blue-300 active:scale-95"
        >
          <span className="transition-all duration-200">
            {isOpen ? "Close Chat" : "Open Chat"}
          </span>
        </Button>
      </div>

      {/* Chat Window with smooth animations */}
      <div 
        className={`w-full max-w-2xl overflow-hidden transition-all duration-500 ease-out ${
          isOpen 
            ? "max-h-80 mb-3 opacity-100 transform translate-y-0 scale-100" 
            : "max-h-0 mb-0 opacity-0 transform translate-y-4 scale-95"
        }`}
      >
        <div className="border rounded-lg shadow-lg bg-white dark:bg-zinc-900 backdrop-blur-sm transition-all duration-300">
          {/* Chat history */}
          <div className="h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 animate-pulse">
                <p>Start a conversation...</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-md my-1 text-sm transition-all duration-300 transform hover:scale-[1.02] animate-fadeInUp ${
                    msg.from === "user"
                      ? "bg-blue-500 text-white ml-auto max-w-[80%] hover:bg-blue-600 shadow-sm"
                      : "bg-gray-200 dark:bg-zinc-700 text-black dark:text-white mr-auto max-w-[80%] hover:bg-gray-300 dark:hover:bg-zinc-600 shadow-sm"
                  }`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>

          {/* Input row */}
          <div className="flex gap-2 p-2 border-t bg-gray-50/50 dark:bg-zinc-800/50 backdrop-blur-sm">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 transition-all duration-200 focus:scale-[1.02] focus:shadow-md border-gray-200 focus:border-blue-400"
            />
            <Button 
              onClick={handleSend}
              className="transition-all duration-200 hover:scale-105 active:scale-95 bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg"
              disabled={!input.trim()}
            >
              <span className="transition-all duration-200">Send</span>
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out forwards;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: rgb(209 213 219);
          border-radius: 4px;
        }
        
        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: rgb(243 244 246);
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
      `}</style>
    </div>
  );
}