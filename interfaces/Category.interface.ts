import type Timestamp from "./Timestamp.interface";

export default interface Category extends Timestamp {
  categoryId: string;
  name: string;
  description: string;
  status: number;
}
