import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

interface Props {
  contents: string;
}
export default function AssistantResponse({ contents }: Props) {
  return <ReactMarkdown children={contents} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}></ReactMarkdown>;
}
