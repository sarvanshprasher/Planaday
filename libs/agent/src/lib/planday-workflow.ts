import { createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { parseIntentStep } from './parse-intent-step.js';
import { fetchExistingScheduleStep } from './fetchexisting-schedule-step.js';
import { checkConflictsStep } from './check-conflict-step.js';
import { createScheduleBlocks } from './create-schedule-blocks-tool.js';
export const planDayWorkflow = createWorkflow({
  id: 'plan-day-workflow',
  inputSchema: z.object({
    userMessage: z.string(),
    date: z.string(), // Added date here
  }),
  outputSchema: z.object({
    proposedBlocks: z.array(
      z.object({
        startHour: z.number(),
        endHour: z.number(),
        title: z.string(),
      })
    ),
  }),
})
  .then(parseIntentStep)
  .then(fetchExistingScheduleStep)
  .then(checkConflictsStep)
  .then(createScheduleBlocks)
  .commit();