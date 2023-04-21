import { CompletionMessage } from "./CompletionMessage";

export interface ChatCompletionPayload {
  model: "gpt-3.5-turbo";
  messages: Array<CompletionMessage>;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  max_tokens?: number;
  stream?: boolean;
  n?: number;
  user?: string;
}
