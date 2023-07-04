import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum GoalDayRecordStatus {
  INITIAL,
  SUCCEED,
  FAILED,
  ERROR,
}

export enum GoalStatus {
  INITIAL,
  ACTIVE,
  PAUSED,
  SUCCEED,
  FAILED,
  ERROR,
}

export type GoalRecordDocument = HydratedDocument<GoalRecord>;

@Schema()
export class GoalRecord {
  @Prop()
  period: 'day'; // отчетным периодом у нас является день
  @Prop()
  id: string; // unique id of goal day record entity in DB, if we need to write it to DB
  @Prop()
  recordIndex: number; //record index starting from 1
  @Prop()
  dateTimestamp: number; // timestamp of record period end, for day it will be the of end the day, e.g. Wed Nov 17 2022 23:59:59 GMT+0300
  @Prop()
  goalId: string; // link to goal entity
  @Prop()
  stepsCount: number; // steps count on this record period
  @Prop()
  status: GoalDayRecordStatus; // record status on record period
}
export const GoalRecordSchema = SchemaFactory.createForClass(GoalRecord);

export type GoalDocument = HydratedDocument<Goal>;

@Schema()
export class Goal {
  @Prop()
  id: string; // unique id of goal entity in DB
  @Prop()
  onchainId: number;
  @Prop()
  userId: string; // link to user entity
  @Prop()
  status: GoalStatus;
  @Prop()
  startDateTimestamp: number; // goal period start date with UTC-offset (user local time) (start of day e.g 'Wed Nov 15 2022 00:00:00 GMT+0300')
  @Prop()
  endDateTimestamp: number; // goal period end date with with UTC-offset (user local time) (end of day e.g 'Wed Nov 17 2022 23:59:59 GMT+0300')
  @Prop()
  durationInDaysCount: number; // duration of goal in days. e.g  endDateDay - startDateDay = 3 days
  @Prop()
  dayRecordsCount: number; // how much day record already created;
  @Prop()
  requiredDailyStepsCount: number; // required steps per day
  @Prop()
  acceptableFailedDaysCount: number; //max failed days
  @Prop()
  failedDaysCount: number; // failed days count
  @Prop()
  betAmount: string; // 10000000000000000 wei = 1 LINK. For now bets only made in Link
  @Prop()
  userTimeZoneOffset: number; // user timezone offset from GMT. e.g +3 for user from moscow timezone
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
