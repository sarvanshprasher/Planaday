import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { scheduleAgent, planDayWorkflow } from '@planaday/agent';

@Controller('agent')
export class AgentController {

  @Post('test')
  async test(@Body('messages') messages: { role: string; content: string }[]) {
    try {
      const result = await scheduleAgent.generate(messages);
      return { reply: result.text };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Error processing agent generation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('workflow-test')
  async workflowTest(@Body('message') message: string) {
    try {
      // Access createRun directly on the planDayWorkflow instance
      const run = await planDayWorkflow.createRun();

      const runResult = await run.start({
        inputData: {
          userMessage: message,
          date: '2026-09-04'
        },
      });
      
      return runResult;
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Error executing workflow',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}