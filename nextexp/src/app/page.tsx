"use client";

import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

interface ConversationType {
  timestamp: number;
  user: string;
  assistant: string;
}

export default function Home() {
  const [userQuestion, setUserQuestion] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<ConversationType>>([]);

  const listConversation = () => {
    const list = chatHistory.map((c) => {
      return (
        <div key={c.timestamp} className="mt-1">
          <strong>{c.user}</strong>
          <ReactMarkdown className="markdown">{c.assistant}</ReactMarkdown>
        </div>
      );
    });
    return (
      <div>
        {list.length > 0 && <hr className="my-2" />}
        {list}
      </div>
    );
  };

  const AskQuestion = async () => {
    const res = await fetch("/api/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userQuestion: userQuestion,
        botResponse: botResponse,
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
          setBotResponse(chunks.join(""));
        }
      }
      const whole = chunks.join("");
      chatHistory.push({ timestamp: Date.now(), user: userQuestion, assistant: whole });
      setChatHistory(chatHistory);
      setUserQuestion("");
    }
  };

  const OnSubmit = async (event?: any) => {
    if (event) event.preventDefault();
    await AskQuestion();
  };

  return (
    <div className="items-baseline">
      <div className="flex">
        <input
          type="text"
          className="border-cyan-600 rounded-md border text-sm p-1 shadow-md flex-1"
          value={userQuestion}
          maxLength={512}
          onChange={(e) => {
            const text = e.target.value;
            setUserQuestion(text);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && userQuestion.length > 3) {
              OnSubmit();
            }
          }}
        />
        <button
          type="submit"
          disabled={userQuestion.length < 3 && userQuestion.length > 512}
          className="ml-2 bg-slate-600 shadow-md text-white px-6 py-1 rounded-md text-sm hover:cursor-pointer hover:text-slate-600 hover:bg-white hover:border-slate-600 hover:border disabled:text-gray-200 disabled:bg-gray-300"
          onClick={OnSubmit}
        >
          Submit
        </button>
      </div>
      <div></div>
      <div>
        <ReactMarkdown className="markdown mt-2 text-start text-gray-600">{botResponse}</ReactMarkdown>
      </div>
      <div>{listConversation()}</div>
    </div>
  );
}
