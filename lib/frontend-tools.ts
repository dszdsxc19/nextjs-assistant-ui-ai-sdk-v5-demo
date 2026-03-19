import { tool } from "@assistant-ui/react";
import { z } from "zod";

// ==================== Calculator Tool Definition ====================

export const calculatorTool = tool({
  description: "Calculator",
  parameters: z.object({
    num1: z.number().describe("the fisrt number"),
    num2: z.number().describe("the second number"),
  }),
  execute: async ({ num1, num2 }) => {
    const sum = num1 + num2;
    return { sum };
  },
});

// ==================== Type Exports ====================

export type CalculatorToolParameters = z.infer<
  typeof calculatorTool.parameters
>;

export type CalculatorToolResult = Awaited<
  ReturnType<typeof calculatorTool.execute>
>;
