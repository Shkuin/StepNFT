export class GoogleFitDailyStepsResponse {
  bucket: BucketItemModel[];
}

export class BucketItemModel {
  startTimeMillis: string;
  endTimeMillis: string;
  dataset: DataSetModel[];
}

export class DataSetModel {
  dataSourceId: string;
  maxEndTimeNs: string;
  minStartTimeNs: string;
  point: PointModel[];
}

export class PointModel {
  startTimeNanos: string;
  endTimeNanos: string;
  dataTypeName: string;
  originDataSourceId: string;
  value: ValueModel;
}

export class ValueModel {
  intVal: number;
  mapVal: Map<string, ValueModel>;
}
