import type { JSONSchema7 } from "json-schema";

export type ToolExecuteFunction<TArgs, TResult> = (
  args: TArgs,
  context: ToolExecutionContext,
) => TResult | Promise<TResult>;

export type ToolExecutionContext = {
  toolCallId: string;
  abortSignal: AbortSignal;
  human: (payload: unknown) => Promise<unknown>;
};

export type FrontendTool<
  TArgs extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown,
> = {
  type?: "frontend" | undefined;
  description?: string | undefined;
  parameters: JSONSchema7;
  disabled?: boolean;
  execute?: ToolExecuteFunction<TArgs, TResult>;
};

export type Tool<
  TArgs extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown,
> = FrontendTool<TArgs, TResult>;

export function tool<TArgs extends Record<string, unknown>, TResult = any>(
  tool: Tool<TArgs, TResult>,
): Tool<TArgs, TResult> {
  return tool;
}
