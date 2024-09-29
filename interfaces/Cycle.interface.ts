import type Timestamp from "./Timestamp.interface";

export default interface Cycle extends Timestamp {
  id: string;
  name: string;
  status: CycleStatus;
}

export interface CycleCollection extends Timestamp {
  data: Cycle
}

export enum CycleStatus {
  ENABLE = 0,
  DISABLE = 1,
}
