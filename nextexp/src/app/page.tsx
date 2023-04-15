"use client";

import { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

interface ConversationType {
  id: number;
  user: string;
  assistant: string;
}

export default function Home() {
  const [userQuestion, setUserQuestion] = useState("");
  const [botAnswer, setBotAnswer] = useState("");
  const [conversation, setConversation] = useState<Array<ConversationType>>([]);

  return (
    <div className="items-baseline">
      <input
        type="text"
        className="border-cyan-600 rounded-md m-2 border text-sm p-1 px-2 shadow-md w-96"
        value={userQuestion}
        onChange={(e) => setUserQuestion(e.target.value)}
      />
      <button
        type="submit"
        className="bg-slate-600 shadow-md text-white px-6 py-1 rounded-md text-sm hover:cursor-pointer hover:text-slate-600 hover:bg-white hover:border-slate-600 hover:border"
        onClick={async (event) => {
          event.preventDefault();
          const res = await fetch("/api/gpt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: userQuestion,
            }),
          });
          if (res.ok) {
            const data = res.body;
            const chunks = [];
            if (data) {
              const reader = data.getReader();
              const decoder = new TextDecoder();
              let done = false;
              while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                chunks.push(chunkValue);
                setBotAnswer(chunks.join(""));
              }
              conversation.push({ id: Date.now(), user: userQuestion, assistant: botAnswer });
              setConversation(conversation);
            }
          }
        }}
      >
        Submit
      </button>
      <ReactMarkdown className="text-sm p-2">{botAnswer}</ReactMarkdown>
    </div>
  );
}
