type Value = {
  intVal: number;
};

type Point = {
  startTimeNanos: null;
  endTimeNanos: null;
  value: Value[];
};

type DataSet = {
  dataSourceId: string;
  point: Point[];
};

type Bucket = {
  startTimeMillis: number;
  endTimeMils: number;
  dataset: DataSet[];
};

export type FitnessApiResponse = {
  bucket: Bucket[];
};
