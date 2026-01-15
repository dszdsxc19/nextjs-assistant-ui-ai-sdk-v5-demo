"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { Thread } from "@/components/assistant-ui/thread";
import { makeAssistantTool, tool } from "@assistant-ui/react";
import { z } from "zod";

const calculatorTool = tool({
  description: "Calculator",
  parameters: z.object({
    num1: z.number().describe("the fisrt number"),
    num2: z.number().describe("the second number"),
  }),
  execute: async ({ num1, num2 }) => {
    console.log("执行到计算阶段");
    const sum = num1 + num2;
    return { sum: sum };
  },
});

const CalculatorTool = makeAssistantTool({
  ...calculatorTool,
  toolName: "calculator",
});

export default function Home() {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
    }),
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div>
        <CalculatorTool />
        <ThreadList />
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
}
