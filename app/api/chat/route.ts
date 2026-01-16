import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { convertToModelMessages, streamText, tool } from "ai";
import z from "zod";

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
      weather: tool({
        description: "Get the weather in a location",
        inputSchema: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      }),
    },
  });
  return result.toUIMessageStreamResponse();
}
