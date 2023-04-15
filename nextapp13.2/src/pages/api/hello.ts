import { OpenAIStream, OpenAIStreamPayload } from "@/utils/OpenAIStream";
export const config = {
  runtime: "edge",
};
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

const handler = async (req: Request): Promise<Response> => {
  const body: any = await req.json();

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
};

export default handler;
