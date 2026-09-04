import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';


export const checkConflictsStep = createStep({
  id: 'check-conflicts',
  inputSchema: z.object({
    proposedBlocks: z.array(
      z.object({ startHour: z.number(), endHour: z.number(), title: z.string() })
    ),
    date: z.string(),
    existingBlocks: z.array(
      z.object({ startHour: z.number(), endHour: z.number(), title: z.string() })
    ),
  }),
  outputSchema: z.object({
    date: z.string(),
    clearBlocks: z.array(
      z.object({ startHour: z.number(), endHour: z.number(), title: z.string() })
    ),
    conflictingBlocks: z.array(
      z.object({ startHour: z.number(), endHour: z.number(), title: z.string() })
    ),
  }),
  execute: async ({ inputData }) => {
    const { proposedBlocks, existingBlocks, date } = inputData;

    const clearBlocks = [];
    const conflictingBlocks = [];

    for (const proposed of proposedBlocks) {
      const overlaps = existingBlocks.some(
        (existing) =>
          proposed.startHour < existing.endHour &&
          existing.startHour < proposed.endHour
      );

      if (overlaps) {
        conflictingBlocks.push(proposed);
      } else {
        clearBlocks.push(proposed);
      }
    }

    return { date, clearBlocks, conflictingBlocks };
  },
});