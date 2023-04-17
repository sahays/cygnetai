import { ChatCompletion } from "@/core/features/ChatCompletion";
import { Completion } from "@/core/features/Completion";
import { CoachGPT } from "@/utils/GPTPersonas";
import { last, reject } from "underscore";

let chatHistory = [...CoachGPT];

const chatCompletion = new ChatCompletion();
const completion = new Completion();

export async function POST(request: Request): Promise<Response> {
  const { userQuestion, botResponse } = (await request.json()) as {
    userQuestion: string;
    botResponse: string;
  };

  const isQuestion: any = await completion.analyzePrompt(`In one word, is the following an inquiry or request or unrelated to mathematics? ${userQuestion}`);
  const historyText = chatHistory.map((c) => {
    return `${c.role} ${c.content}`;
  });
  const summaryArg = `Summarize this conversation in less than 25 words: ${historyText.join("")}`;
  console.log(`chat length: ${chatHistory.length}`);
  const summary: any = await completion.analyzePrompt(summaryArg);
  console.log(`nature of the prompt: ${isQuestion.choices[0].text.replace("\n\n", "")} Q: ${userQuestion}`);
  console.log(`summary: ${summary.choices[0].text.replace("\n\n", "")}`);

  if (botResponse.length > 0) {
    if (botResponse.indexOf("[--ignore-unrelated]") > -1) {
      // ignore this response and remove the last question
      chatHistory = reject(chatHistory, (el) => {
        return el.content == last(chatHistory)?.content;
      });
    } else {
      chatHistory.push({
        role: "assistant",
        content: botResponse,
      });
    }
  }

  chatHistory.push({
    role: "user",
    content: userQuestion,
  });

  try {
    const stream = await chatCompletion.provideAnswer(chatHistory);
    return new Response(stream);
  } catch (e: any) {
    console.error(e.message);
    throw new Error(`Server error`);
  }
}
