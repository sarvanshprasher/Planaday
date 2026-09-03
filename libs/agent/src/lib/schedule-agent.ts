import { Agent } from '@mastra/core/agent';
import { getScheduleForDate } from './get-schedule-tool.js';
import { createScheduleBlocks } from './create-schedule-blocks-tool.js';
export const scheduleAgent = new Agent({
  id: 'schedule-agent',
  name: 'Schedule Agent',
  instructions: `You are a helpful assistant that turns a user's free-text description of their day into a structured schedule.`,
  model: {
    id: 'google/gemini-3.6-flash',
  },
  tools: {getScheduleForDate,createScheduleBlocks}
});