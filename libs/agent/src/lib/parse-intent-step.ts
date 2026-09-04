import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';

export const parseIntentStep = createStep({
  id: 'parse-intent',
  inputSchema: z.object({
    userMessage: z.string(),
    date: z.string(),
  }),
  outputSchema: z.object({
    proposedBlocks: z.array(
      z.object({ startHour: z.number(), endHour: z.number(), title: z.string() })
    ),
    date: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { object } = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: z.object({
        proposedBlocks: z.array(
          z.object({ startHour: z.number(), endHour: z.number(), title: z.string() })
        ),
      }),
      prompt: `Turn this into schedule blocks with specific hours (0-23). If a time is ambiguous, make a reasonable assumption. User said: "${inputData.userMessage}"`,
    });
    return { ...object, date: inputData.date };
  },
});