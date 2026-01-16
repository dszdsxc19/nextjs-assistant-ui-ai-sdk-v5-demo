# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 + Assistant-UI AI SDK v5 demo application with chat interface and tool integration.

## Running Commands

```bash
pnpm dev              # Start development server (port 3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

## Architecture

### Frontend (Assistant-UI)

```
app/page.tsx                    # Main layout with Thread + ThreadList
components/assistant-ui/         # Assistant-UI components
  - thread.tsx                  # Chat interface (messages, composer, welcome screen)
  - thread-list.tsx             # Chat history sidebar
  - markdown-text.tsx           # Markdown rendering
  - tool-fallback.tsx           # Tool fallback UI
  - tooltip-icon-button.tsx     # Reusable tooltip button
  - attachment.tsx              # File attachment handling
```

### API Route

```
app/api/chat/route.ts           # Chat API endpoint
  - Uses MiniMax AI provider (MiniMax-M2.1 model)
  - Streams responses via @ai-sdk/react
  - Supports frontend-defined tools via @assistant-ui/react-ai-sdk
```

### UI Components

```
components/ui/                  # Shadcn/UI components
  - button.tsx, avatar.tsx, dialog.tsx, skeleton.tsx, tooltip.tsx
lib/utils.ts                    # cn() utility (clsx + tailwind-merge)
```

## Key Dependencies

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **@assistant-ui/react** + **@assistant-ui/react-ai-sdk** for chat UI
- **@ai-sdk/react** + **@ai-sdk/openai-compatible** for AI streaming
- **Tailwind CSS v4** for styling
- **Zod** for schema validation

## Environment Variables

```bash
MINIMAX_API_KEY                 # API key for MiniMax AI provider
```

## Custom Tools Pattern

Tools are defined using `@assistant-ui/react`'s `makeAssistantTool` and `tool` utilities:

```typescript
const myTool = tool({
  description: "Tool description",
  parameters: z.object({ ... }),
  execute: async ({ ... }) => { /* ... */ },
});

const MyToolUI = makeAssistantTool({
  ...myTool,
  toolName: "myTool",
  render: ({ args, result, status }) => { /* custom UI */ },
});
```

Then use `<MyToolUI />` in the component tree. The tool will be registered automatically with the chat runtime.
