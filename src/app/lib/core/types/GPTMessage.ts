export interface GPTMessage {
  role: "user" | "system" | "assistant";
  content: string;
}
