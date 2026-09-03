import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const getScheduleForDate = createTool({
  id: 'get-schedule-for-date',
  description: 'Get all existing schedule blocks for a given date, so you can avoid conflicts when proposing new blocks.',
  inputSchema: z.object({
    date: z.string().describe('ISO date, e.g. 2026-08-20'),
  }),
  execute: async ({ date }) => {
    const res = await fetch(`http://localhost:3001/api/schedule?date=${date}`);
    const blocks = await res.json();
    return blocks;
  },
});