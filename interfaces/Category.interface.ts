import type Timestamp from "./Timestamp.interface";

export default interface Category extends Timestamp {
  id: string;
  name: string;
  status: CategoryStatus;
  description: string;
}

export interface CategoryCollection extends Timestamp {
  data: Category
}

export enum CategoryStatus {
  ACTIVE = 0,
  DISABLE = 1,
  PAUSE = 2
}
