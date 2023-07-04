import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { uniqueId } from 'lodash';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';

import { CreateGoalDto } from './goals.dto';
import {
  Goal,
  GoalDocument,
  GoalRecord,
  GoalRecordDocument,
  GoalStatus,
} from './goals.schema';
import { User, UserDocument } from 'src/user/user.schema';
import { GoogleFitDailyStepsResponse as GoogleFitDailyStepsBodyRes } from './goals.types';
import { HttpService } from '@nestjs/axios';
export interface IGoalDayRecord {
  startTimeMillis: string;
  startTimeFormatted: string;
  endTimeMillis: string;
  endTimeMillisFormatted: string;
  recordIndex: number;
  stepsCount: number;
}

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(Goal.name)
    private readonly goalModel: Model<GoalDocument>,
    @InjectModel(GoalRecord.name)
    private readonly goalRecordModel: Model<GoalRecordDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async createGoal(userId: string, dto: CreateGoalDto) {
    try {
      const goalStartDate = moment().subtract(4, 'days').startOf('day');
      const goalEndDate = goalStartDate
        .clone()
        .add(dto.durationInDaysCount, 'days')
        .endOf('day');
      const goalStartDateTimestamp = goalStartDate.valueOf();
      const goalEndDateTimestamp = goalEndDate.valueOf();

      const goal = new this.goalModel({
        onchainId: dto.onchainId,
        userId: userId,
        status: GoalStatus.ACTIVE,
        startDateTimestamp: goalStartDateTimestamp,
        endDateTimestamp: goalEndDateTimestamp,
        durationInDaysCount: dto.durationInDaysCount,
        dayRecordsCount: 0,
        requiredDailyStepsCount: dto.requiredDailyStepsCount,
        acceptableFailedDaysCount: dto.acceptableFailedDaysCount,
        failedDaysCount: 0,
        betAmount: dto.betAmount,
        userTimeZoneOffset: dto.userTimeZoneOffset,
      });

      console.log(goal);
      await goal.save();

      return goal;
    } catch (error) {
      console.error(error);

      throw new BadRequestException();
    }
  }

  findGoalByOnchainId(onchainId: string, userId: string) {
    return this.goalModel.findOne({ onchainId, userId });
  }

  findByUserId(userId: string) {
    return this.goalModel.find({ userId });
  }

  findRecordsByOnchainGoalId(goalId: string) {
    return this.goalRecordModel.find({ goalId });
  }

  findRecordsByGoalOnchainIdAndRecordIndex(
    onchainId: string,
    recordIndex: number,
  ) {
    return this.goalRecordModel.find({ onchainId, recordIndex });
  }

  async getGoalDayRecordById(onchainId: string, recordIndex: string) {
    const records: IGoalDayRecord[] = await this.getGoalDayRecords(onchainId);

    const record: IGoalDayRecord | undefined = records.find(
      (record) => record.recordIndex === Number(recordIndex),
    );

    return {
      recordIndex: recordIndex,
      stepsCount: record?.stepsCount || 0,
    };
  }

  async getGoalDayRecords(onchainId: string): Promise<IGoalDayRecord[]> {
    const goal = await this.goalModel.findOne<Goal>({ onchainId });
    if (!goal) throw new NotFoundException();

    const user = await this.userModel.findById(goal.userId);
    if (!user) throw new InternalServerErrorException();

    const options = {
      method: 'POST',
      url: this.configService.get('GOOGLE_FITNESS_API_URL'),
      headers: {
        'Content-Type': 'application/json;encoding=utf-8',
        Authorization: 'Bearer ' + user.googleAccessToken,
      },
      data: {
        aggregateBy: [
          {
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId:
              'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
          },
        ],
        bucketByTime: { durationMillis: 86400000 }, // 24 hours in milliseconds
        startTimeMillis: goal.startDateTimestamp,
        endTimeMillis: goal.endDateTimestamp,
      },
    };

    let body: GoogleFitDailyStepsBodyRes;
    try {
      console.log('user.googleAccessToken', user.googleAccessToken);
      const response = await this.httpService.request(options).toPromise();

      body = (await response.data) as GoogleFitDailyStepsBodyRes;
    } catch (error) {
      console.error(error);
      if (!user) throw new InternalServerErrorException();
    }

    const records = body.bucket.map((record, i) => {
      const startTimeFormatted = moment(
        Number(record.startTimeMillis),
      ).format();

      const endTimeMillisFormatted = moment(
        Number(record.endTimeMillis),
      ).format();

      return {
        startTimeMillis: record.startTimeMillis,
        startTimeFormatted: startTimeFormatted,
        endTimeMillis: record.endTimeMillis,
        endTimeMillisFormatted: endTimeMillisFormatted,
        recordIndex: i + 1,
        stepsCount: (record.dataset[0]?.point[0]?.value[0]?.intVal || 0) as number,
      };
    });
    return records;
  }
}
