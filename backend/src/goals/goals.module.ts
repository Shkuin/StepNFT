import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalsService } from './goals.service';
import { Goal, GoalRecord, GoalRecordSchema, GoalSchema } from './goals.schema';
import { GoalsController } from './goals.controller';
import { User, UserSchema } from 'src/user/user.schema';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: Goal.name, schema: GoalSchema },
      { name: GoalRecord.name, schema: GoalRecordSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [GoalsService],
  controllers: [GoalsController],
})
export class GoalsModule {}
