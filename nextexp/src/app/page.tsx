"use client";

import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
export default function Home() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  return (
    <div className="items-baseline">
      <input
        type="text"
        className="border-cyan-600 rounded-md m-2 border text-sm p-1 px-2 shadow-md w-96"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="bg-slate-600 shadow-md text-white px-6 py-1 rounded-md text-sm hover:cursor-pointer hover:text-slate-600 hover:bg-white hover:border-slate-600 hover:border"
        onClick={async (event) => {
          event.preventDefault();
          console.log(content);
          const res = await fetch("/api/gpt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: content,
            }),
          });
          if (res.ok) {
            const data = res.body;
            if (data) {
              const reader = data.getReader();
              const decoder = new TextDecoder();
              let done = false;
              while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                console.log(value, chunkValue);
                setResult((prev) => prev + chunkValue);
              }
            }
          }
        }}
      >
        Submit
      </button>
      <ReactMarkdown className="text-sm p-2">{result}</ReactMarkdown>
    </div>
  );
}
