import { GPTMessage } from "./GPTMessage";

export interface GPTPayload {
  model: string;
  messages: Array<GPTMessage>;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  max_tokens?: number;
  stream?: boolean;
  n?: number;
  user?: string;
}
