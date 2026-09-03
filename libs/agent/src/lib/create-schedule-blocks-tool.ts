import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const createScheduleBlocks = createTool({
  id: 'create-schedule-blocks',
  description: 'Create one or more new schedule blocks. Only call this after checking the existing schedule and confirming there are no conflicts. Ask the user for clarification instead of guessing if a time is ambiguous.',
  inputSchema: z.object({
    blocks: z.array(
      z.object({
        date: z.string().describe('ISO date, e.g. 2026-08-20'),
        startHour: z.number().describe('0-23'),
        endHour: z.number().describe('0-23, must be greater than startHour'),
        title: z.string(),
      })
    ),
  }),
  execute: async ({ blocks }) => {
    const created = [];
    for (const block of blocks) {
      const res = await fetch('http://localhost:3001/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...block,
          status: 'planned',
          createdBy: 'agent',
        }),
      });
      created.push(await res.json());
    }
    return { created };
  },
});