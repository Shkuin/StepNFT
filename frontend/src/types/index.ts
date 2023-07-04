export enum GoalStatus {
  PENDING = 0,
  ACTIVE = 1,
  PAUSE = 2,
  SUCCESS = 3,
  FAIL = 4,
  ERROR = 5
}

export enum GoalDayRecordStatus {
  PENDING = 0,
  SUCCESS = 1,
  FAIL = 2
}

export interface IOffchainGoal {
  id: string
  onchainId: number
  userId: string
  status: GoalStatus
  startDateTimestamp: number
  endDateTimestamp: number
  durationInDaysCount: number
  dayRecordsCount: number
  requiredDailyStepsCount: number
  acceptableFailedDaysCount: number
  failedDaysCount: number
  betAmount: string
  userTimeZoneOffset: number
}

export interface GoalDayRecord {
  id: number
  status: GoalDayRecordStatus
  statusName: string
  trackDayTimestamp: number
  recordDateTimestamp: number
  stepsCount: number
}

export enum GoalNftMetadataAttributeId {
  'status_trait',
  'duration_days_count_trait',
  'day_records_count_trait',
  'max_fail_days_count_trait',
  'fail_days_count_trait',
  'daily_steps_count_trait',
  'bet_amount_trait'
}

export const GoalNftMetadataAttributeIndexIdMap: Record<number, GoalNftMetadataAttributeId> = {
  0: GoalNftMetadataAttributeId.status_trait,
  1: GoalNftMetadataAttributeId.duration_days_count_trait,
  2: GoalNftMetadataAttributeId.day_records_count_trait,
  3: GoalNftMetadataAttributeId.max_fail_days_count_trait,
  4: GoalNftMetadataAttributeId.fail_days_count_trait,
  5: GoalNftMetadataAttributeId.daily_steps_count_trait,
  6: GoalNftMetadataAttributeId.bet_amount_trait
}

export const GoalStatusNameMap: Record<GoalStatus, string> = {
  [GoalStatus.PENDING]: 'PENDING',
  [GoalStatus.ACTIVE]: 'ACTIVE',
  [GoalStatus.PAUSE]: 'PAUSE',
  [GoalStatus.SUCCESS]: 'SUCCESS',
  [GoalStatus.FAIL]: 'FAIL',
  [GoalStatus.ERROR]: 'ERROR',
}


export interface GoalNftMetadataAttribute {
  display_type: string,
  trait_type: string,
  trait_type_id?: GoalNftMetadataAttributeId
  value: string
}

export interface GoalNftMetadata {
  name: string
  description: string
  image: string
  attributes: GoalNftMetadataAttribute[]
}

export interface IGoal {
  id: number;
  status: string;
  durationDaysCount: number;
  dayRecordsCount: number;
  lastDayRecordTimestamp: number;
  maxFailDaysCount: number;
  failDaysCount: number;
  dailyStepsCount: number;
  betAmount: string;
  userAddr: string;
  goalDayRecords: (GoalDayRecord)[];
  goalNft: GoalNftMetadata | undefined;
  upkeepID: string;
  startDateTimestamp: number;
  endDateTimestamp: number;

  // id: BigNumber;
  // status: number;
  // durationDaysCount: BigNumber;
  // dayRecordsCount: BigNumber;
  // currentDayRecordRequestId: string;
  // lastDayRecordTimestamp: BigNumber;
  // maxFailDaysCount: BigNumber;
  // failDaysCount: BigNumber;
  // dailyStepsCount: BigNumber;
  // betAmount: BigNumber;
  // userAddr: string;
  // upkeepID: BigNumber;
}