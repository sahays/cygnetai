import { OpenAIStream, OpenAIStreamPayload } from "@/utils/OpenAIStream";

export async function POST(request: Request): Promise<Response> {
  const body: any = await request.json();

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: body.content,
      },
    ],
    stream: true,
  };
  try {
    const stream = await OpenAIStream(payload);
    return new Response(stream);
  } catch (e: any) {
    console.error(e.message);
    throw new Error(`Server error`);
  }
}
