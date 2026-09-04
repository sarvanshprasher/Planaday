import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';

export const createScheduleBlocks = createStep({
  id: 'create-schedule-blocks',
  description: 'Create one or more new schedule blocks. Only call this after checking the existing schedule and confirming there are no conflicts. Ask the user for clarification instead of guessing if a time is ambiguous.',
  inputSchema: z.object({
    date: z.string(),
    clearBlocks: z.array(
      z.object({ startHour: z.number(), endHour: z.number(), title: z.string() })
    ),
    conflictingBlocks: z.array(
      z.object({ startHour: z.number(), endHour: z.number(), title: z.string() })
    ),
  }),
  outputSchema: z.object({
    proposedBlocks: z.array(
      z.object({ startHour: z.number(), endHour: z.number(), title: z.string() })
    ),
  }),
  execute: async (context) => {
    const { date, clearBlocks } = context.inputData;
    const created: Array<{ startHour: number; endHour: number; title: string }> = [];

    // Create the non-conflicting (clear) blocks
    for (const block of clearBlocks) {
      const res = await fetch('http://localhost:3001/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          startHour: block.startHour,
          endHour: block.endHour,
          title: block.title,
          status: 'planned',
          createdBy: 'agent',
        }),
      });

      const data = (await res.json()) as {
        startHour: number;
        endHour: number;
        title: string;
      };

      created.push({
        startHour: data.startHour,
        endHour: data.endHour,
        title: data.title,
      });
    }

    return { proposedBlocks: created };
  },
});