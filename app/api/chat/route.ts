import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { convertToModelMessages, streamText } from "ai";

export const maxDuration = 30;

const provider = createOpenAICompatible({
  name: "Minimax",
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: "https://api.minimaxi.com/v1",
});

export async function POST(req: Request) {
  const { messages, tools } = await req.json();
  const result = streamText({
    model: provider("MiniMax-M2.1"),
    messages: convertToModelMessages(messages),
    tools: {
      ...frontendTools(tools), // Client-defined tools
    },
  });
  return result.toUIMessageStreamResponse();
}
