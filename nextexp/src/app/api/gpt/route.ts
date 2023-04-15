import { CoachGPT } from "@/utils/GPTPersonas";
import { ToReadableStream } from "@/utils/ChatCompletionStream";
import { GPTPayload } from "@/utils/GPTModel";

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as { content: string };

  CoachGPT.push({
    role: "user",
    content: body.content,
  });

  const payload: GPTPayload = {
    model: "gpt-3.5-turbo",
    messages: CoachGPT,
    stream: true,
  };
  try {
    console.log(payload);
    const stream = await ToReadableStream(payload);
    return new Response(stream);
  } catch (e: any) {
    console.error(e.message);
    throw new Error(`Server error`);
  }
}
