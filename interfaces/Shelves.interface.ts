import type Timestamp from "./Timestamp.interface";

export default interface Shelves extends Timestamp {
  shelveId: string;
  name: string;
  description: string;
  location: string;
  status: number;
}
