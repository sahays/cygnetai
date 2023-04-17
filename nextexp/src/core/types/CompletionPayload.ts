export interface CompletionPayload {
  model: "text-davinci-003" | "text-curie-001" | "text-babbage-001" | "text-ada-001";
  prompt: string;
  temperature?: number;
  suffix?: string;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  max_tokens?: number;
  stream?: boolean;
  n?: number;
  user?: string;
  logprobs?: number;
  echo?: boolean;
  best_of?: number;
}
