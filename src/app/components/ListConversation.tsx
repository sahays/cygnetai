"use client";

import { ConversationType } from "../lib/core/types/ConversationType";
import React from "react";
import AssistantResponse from "./AssistantResponse";

interface Props {
  chatHistory: Array<ConversationType>;
}

export default function ListConversation({ chatHistory }: Props) {
  const list = chatHistory.map((h) => {
    <div key={h.timestamp}>
      <div>{h.user}</div>
      <AssistantResponse contents={h.assistant}></AssistantResponse>
    </div>;
  });
  return <>{list}</>;
}
