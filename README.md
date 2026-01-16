# Next.js + Assistant-UI + AI SDK v5 Demo

A chat interface built with Next.js 15, **Assistant-UI**, and **AI SDK v5** with MiniMax provider.

## AI SDK v5 Architecture

This project uses the new AI SDK v5 architecture:

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                          │
│  ┌───────────────────────────────────────────────┐  │
│  │  @assistant-ui/react                         │  │
│  │  - AssistantRuntimeProvider                  │  │
│  │  - Thread (Chat UI)                          │  │
│  │  - ThreadList (History)                      │  │
│  │  - Custom Tools (makeAssistantTool)          │  │
│  └───────────────────────────────────────────────┘  │
│                        │                             │
│                        ▼                             │
│              /api/chat (POST)                       │
│                        │                             │
└────────────────────────┼─────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                 AI SDK v5 Backend                    │
│  ┌───────────────────────────────────────────────┐  │
│  │  @ai-sdk/react                               │  │
│  │  - streamText()                              │  │
│  │  - convertToModelMessages()                  │  │
│  └───────────────────────────────────────────────┘  │
│                        │                             │
│                        ▼                             │
│              @ai-sdk/openai-compatible              │
│              (MiniMax provider)                      │
└─────────────────────────────────────────────────────┘
```

## Features

- Chat interface with message history
- Collapsible sidebar for chat history
- **Client-side tools** with Assistant-UI
- Markdown rendering support
- Responsive design (mobile-friendly)

## Client-Side Tools (Assistant-UI)

Assistant-UI provides a powerful way to create client-side tools that integrate with the chat UI. Tools are defined using `makeAssistantTool` and `tool`:

```tsx
import { makeAssistantTool, tool } from "@assistant-ui/react";
import { z } from "zod";

// 1. Define the tool with tool()
const calculatorTool = tool({
  description: "A calculator for basic math",
  parameters: z.object({
    num1: z.number().describe("First number"),
    num2: z.number().describe("Second number"),
  }),
  execute: async ({ num1, num2 }) => {
    return { sum: num1 + num2 };
  },
});

// 2. Create the AssistantTool component with makeAssistantTool()
const CalculatorTool = makeAssistantTool({
  ...calculatorTool,
  toolName: "calculator",
  render: ({ args, result, status }) => {
    return (
      <div className="...">
        <span>{args.num1}</span>
        <span>+</span>
        <span>{args.num2}</span>
        <span>=</span>
        <span>{result?.sum ?? "..."}</span>
      </div>
    );
  },
});

// 3. Use the component in your app
export default function Home() {
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <CalculatorTool />
      <Thread />
    </AssistantRuntimeProvider>
  );
}
```

### Tool Execution Flow

1. User triggers the tool (e.g., via prompt or UI)
2. Assistant-UI calls `execute()` on the client
3. Result is passed to `render()` for custom UI display
4. Tool result is sent to the server as part of the conversation

### Tool Render Props

```tsx
render: ({
  args,       // The arguments passed to the tool
  result,     // The result from execute()
  status,     // "streaming" | "complete" | "error"
  isRunning,  // boolean - tool is currently executing
}) => {
  // Build your custom UI
}
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure

```
├── app/
│   ├── api/chat/route.ts       # Chat API endpoint (AI SDK v5)
│   ├── page.tsx                # Main layout + Tools
│   └── layout.tsx              # Root layout
├── components/
│   ├── assistant-ui/           # Assistant-UI components
│   │   ├── thread.tsx          # Chat thread
│   │   ├── thread-list.tsx     # Chat history sidebar
│   │   ├── markdown-text.tsx   # Markdown renderer
│   │   └── ...
│   └── ui/                     # Shadcn/UI components
├── lib/
│   └── utils.ts                # Utility functions
└── CLAUDE.md                   # Claude Code guidance
```

## Environment Variables

Create a `.env.local` file:

```env
MINIMAX_API_KEY=your-api-key
```

## Tech Stack

- **Next.js 16** with App Router
- **React 19** + TypeScript
- **@assistant-ui/react** + **@assistant-ui/react-ai-sdk** v1.x
- **@ai-sdk/react** + **@ai-sdk/openai-compatible** v1.x (AI SDK v5)
- Tailwind CSS v4
- Zod for validation
