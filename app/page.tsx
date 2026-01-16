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
import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* 侧边栏 - Thread List */}
        <aside
          className={`
            fixed lg:relative z-20 transition-all duration-300 ease-in-out
            ${
              isSidebarOpen
                ? "w-64 translate-x-0"
                : "w-64 -translate-x-full lg:translate-x-0 lg:w-16"
            }
            h-full border-r bg-card shadow-sm overflow-hidden
          `}
        >
          {/* 侧边栏头部 */}
          <div className="flex h-14 items-center justify-between border-b px-3">
            {isSidebarOpen && (
              <span className="text-sm font-semibold text-foreground">
                Chat History
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-8 w-8 shrink-0"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <XIcon className="h-4 w-4" />
              ) : (
                <MenuIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Thread List 容器 */}
          <div
            className={`h-[calc(100%-3.5rem)] overflow-y-auto ${
              isSidebarOpen ? "p-2" : "p-1"
            }`}
          >
            <ThreadList />
          </div>
        </aside>

        {/* 移动端遮罩层 */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 主内容区 - Thread */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* 移动端顶部栏 */}
          <header className="lg:hidden flex h-14 items-center border-b px-4">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 h-8 w-8"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MenuIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">New Chat</span>
          </header>

          {/* 工具和聊天区域 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 工具栏 */}
            <div className="flex-shrink-0 border-b p-4">
              <div className="mx-auto max-w-3xl">
                <CalculatorTool />
              </div>
            </div>

            {/* Thread 聊天区域 */}
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </div>
        </main>
      </div>
    </AssistantRuntimeProvider>
  );
}
