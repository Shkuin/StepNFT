import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { FitnessApiResponse } from './types';

const BUCKET_DEFAULT_SIZE = 86400000;

@Injectable()
export class StepsService {
  apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get('GOOGLE_FITNESS_API_URL');
  }

  async getSteps(
    userId: string,
    startTime: number,
    endTime: number,
    bucketSize = BUCKET_DEFAULT_SIZE,
  ) {
    const accessKey = await this.userService.getUserAccessKey(userId);

    const resp = await this.httpService.axiosRef.post<FitnessApiResponse>(
      this.apiUrl,
      {
        aggregateBy: [
          {
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId:
              'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
          },
        ],
        bucketByTime: { durationMillis: bucketSize },
        startTimeMillis: startTime,
        endTimeMillis: endTime,
      },
      {
        headers: {
          Authorization: `Bearer ${accessKey}`,
        },
      },
    );

    const aggregated = resp.data.bucket
      .flatMap((bucket) =>
        bucket.dataset.flatMap((dataset) =>
          dataset.point.flatMap((point) =>
            point.value.flatMap((value) => value.intVal),
          ),
        ),
      )
      .reduce((acc, values) => {
        return acc + values;
      }, 0);

    return {
      steps: aggregated,
    };
  }
}
