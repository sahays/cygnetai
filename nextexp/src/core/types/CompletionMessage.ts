export interface CompletionMessage {
  role: "user" | "system" | "assistant";
  content: string;
}
