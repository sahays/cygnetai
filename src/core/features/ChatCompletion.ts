import { ToReadableStream } from "@/utils/ChatCompletionStream";
import { GPTMessage } from "@/utils/GPTModel";
import { ChatCompletionPayload } from "../types/ChatCompletionPayload";

export class ChatCompletion {
  public provideAnswer(history: Array<GPTMessage>): Promise<ReadableStream<any>> {
    const encoder = new TextEncoder();
    const payload: ChatCompletionPayload = {
      model: "gpt-3.5-turbo",
      messages: history,
      stream: true,
      temperature: 0,
    };
    return ToReadableStream(
      async () => {
        const opts = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
          },
          method: "POST",
          body: JSON.stringify(payload),
        };
        const res = await fetch("https://api.openai.com/v1/chat/completions", opts);

        if (!res.ok) {
          throw new Error(`GPT call failed: ${res.statusText}`);
        }
        return res;
      },
      (event, controller) => {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            if (text) {
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            }
          } catch (e) {
            // maybe parse error
            controller.error(e);
          }
        }
      }
    );
  }
}
