import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { StepsService } from './steps.service';

@Controller('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Get()
  @UseGuards(AuthGuard('magic'))
  async getSteps(
    @Query('startTime') startTime: number,
    @Query('endTime') endTime: number,
    @Request() req,
  ) {
    const userId = req.user._doc._id;
    return this.stepsService.getSteps(userId, startTime, endTime);
  }

  @UseGuards(AuthGuard('magic'))
  @Get('test')
  async test(@Request() req) {
    return 'hello';
  }
}
