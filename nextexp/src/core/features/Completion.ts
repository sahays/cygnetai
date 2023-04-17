import { CompletionPayload } from "../types/CompletionPayload";

export interface CompletionResult {
  choices: Array<{
    text: string;
  }>;
}

export class Completion {
  public async analyzePrompt(message: string) {
    const payload: CompletionPayload = {
      model: "text-davinci-003",
      prompt: message,
      temperature: 0.2,
    };

    const opts = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    };
    const res = await fetch("https://api.openai.com/v1/completions", opts);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`${payload} failed`);
    }
  }
}
