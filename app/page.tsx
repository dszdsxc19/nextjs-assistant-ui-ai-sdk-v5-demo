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
  render: ({ args, result, status }) => {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 px-4 py-3 border border-violet-200/20 dark:border-violet-700/30">
        <span className="text-violet-600 dark:text-violet-400 font-medium">
          {args.num1}
        </span>
        <span className="text-violet-400">+</span>
        <span className="text-violet-600 dark:text-violet-400 font-medium">
          {args.num2}
        </span>
        <span className="text-violet-400">=</span>
        <span className="ml-1 px-3 py-1 rounded-md bg-violet-500 text-white font-bold text-lg shadow-lg shadow-violet-500/30">
          {result?.sum ?? "..."}
        </span>
      </div>
    );
  },
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
