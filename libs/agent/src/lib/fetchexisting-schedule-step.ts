import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';

export const fetchExistingScheduleStep = createStep({
  id: 'fetch-existing-schedule',
  inputSchema: z.object({
    proposedBlocks: z.array(
      z.object({ startHour: z.number(), endHour: z.number(), title: z.string() })
    ),
    date: z.string(),
  }),
  outputSchema: z.object({
    proposedBlocks: z.array(
      z.object({ startHour: z.number(), endHour: z.number(), title: z.string() })
    ),
    date: z.string(),
    existingBlocks: z.array(
      z.object({ startHour: z.number(), endHour: z.number(), title: z.string() })
    ),
  }),
  execute: async (context) => {
    const inputData = context.inputData;
    const res = await fetch(`http://localhost:3001/api/schedule?date=${inputData.date}`);
    
    // Type-cast the response to match outputSchema's expected shape
    const existingBlocks = (await res.json()) as Array<{
      startHour: number;
      endHour: number;
      title: string;
    }>;
    
    return { 
      proposedBlocks: inputData.proposedBlocks,
      date: inputData.date,
      existingBlocks,
    };
  },
});