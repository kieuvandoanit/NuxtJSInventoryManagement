import type Timestamp from "./Timestamp.interface";

export default interface Shelves extends Timestamp {
  id: string;
  name: string;
  description: string;
  status: number;
}

export interface ShelfCollection extends Timestamp {
  data: Shelves
}

export enum ShelfStatus {
  ENABLE = 0,
  DISABLE = 1,
  FULL = 2
}
