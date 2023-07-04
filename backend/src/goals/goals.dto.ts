export type CreateGoalDto = {
  onchainId: number; // id generated on contract
  // userId: string; // link to user entity
  startDateTimestamp: number; // goal period start date with UTC-offset (user local time) (start of day e.g 'Wed Nov 15 2022 00:00:00 GMT+0300')
  endDateTimestamp: number; // goal period end date with with UTC-offset (user local time) (end of day e.g 'Wed Nov 17 2022 23:59:59 GMT+0300')
  durationInDaysCount: number; // duration of goal in days. e.g  endDateDay - startDateDay = 3 days
  // dayRecordsCount: number; // how much day record already created;
  requiredDailyStepsCount: number; // required steps per day
  acceptableFailedDaysCount: number; //max failed days
  // failedDaysCount: number; // failed days count
  betAmount: string; // 10000000000000000 wei = 1 LINK. For now bets only made in Link
  userTimeZoneOffset: number; // user timezone offset from GMT. e.g +3 for user from moscow timezone
};
