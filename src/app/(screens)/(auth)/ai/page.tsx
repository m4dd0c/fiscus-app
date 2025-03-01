"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useStore } from "@/hook/useStore";
import Loader from "@/components/shared/Loader";
import axios from "axios";

const Page = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/chat", {
        message: input,
      });

      setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error occurred." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const { loading: accountLoading, accounts, fetchAccounts } = useStore();

  useEffect(() => {
    if (accounts.length === 0) fetchAccounts();
  }, [fetchAccounts, accounts]);

  return accountLoading ? (
    <Loader />
  ) : accounts.length === 0 ? (
    <div className="h-[91vh] grid place-items-center">
      No Bank Account Added Yet.
    </div>
  ) : (
    <div className="flex flex-col h-[91vh] p-4">
      {/* Chat Messages Area */}
      <div className="mb-4 pt-40 h-[75vh] overflow-y-scroll p-4 w-full mx-auto ">
        {messages.length === 0 && (
          <p className="text-center mt-52 font-bold text-xl">
            💰 Fiscus AI Chat <br />
            Ask me anything about your finances!
          </p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`px-4 py-2 rounded-xl my-4 max-w-xl mx-auto  ${
              msg.role === "user"
                ? "bg-white/10 rounded-br-none"
                : "rounded-bl-none border"
            }`}
          >
            {msg.role === "bot" ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-lg self-start mr-auto shadow-sm">
            <Loader2 className="animate-spin text-gray-500" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="w-3/4 mx-auto h-14 border rounded-full mt-1 mb-5 flex items-center justify-between px-3 space-x-2 shadow-md">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your finances..."
          className="flex-1 border-none focus-visible:ring-0 text-lg"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <Button
          onClick={sendMessage}
          disabled={loading}
          className="py-2 bg-gray-600 rounded-full px-3"
        >
          <Send size={18} className="rotate-45 text-orange-500" />
        </Button>
      </div>
    </div>
  );
};

export default Page;
