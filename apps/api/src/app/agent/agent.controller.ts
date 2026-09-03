import { Controller, Post, Body } from '@nestjs/common';
import { scheduleAgent } from '@planaday/agent';

@Controller('agent')
export class AgentController {

  @Post('test')
  async test(@Body('messages') messages: { role: string; content: string }[]) {
    const result = await scheduleAgent.generate(messages);
    return { reply: result.text };
  }
}