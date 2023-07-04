import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateGoalDto } from './goals.dto';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @UseGuards(AuthGuard('magic'))
  createGoal(@Body() dto: CreateGoalDto, @Request() req) {
    const userId: string = req.user._doc._id;
    return this.goalsService.createGoal(userId, dto);
  }

  @Get('/')
  @UseGuards(AuthGuard('magic'))
  findGoalByUserId(@Request() req) {
    const userId = req.user._doc._id as string;
    return this.goalsService.findByUserId(userId);
  }

  @Get('/:onchainId')
  @UseGuards(AuthGuard('magic'))
  findGoalByOnchainId(@Param('onchainId') onchainId: string, @Request() req) {
    const userId = req.user._doc._id as string;
    return this.goalsService.findGoalByOnchainId(onchainId, userId);
  }

  @Get('/:onchainId/records')
  getGoalDayRecords(@Param('onchainId') onchainId: string) {
    return this.goalsService.getGoalDayRecords(onchainId);
  }

  @Get('/:onchainId/records/:recordIndex')
  getGoalDayRecordById(
    @Param('onchainId') onchainId: string,
    @Param('recordIndex') recordIndex: string,
  ) {
    return this.goalsService.getGoalDayRecordById(onchainId, recordIndex);
  }
}
