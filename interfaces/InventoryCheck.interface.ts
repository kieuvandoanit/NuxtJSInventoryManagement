import type Timestamp from "./Timestamp.interface";

// Interface for a single stock check entry
export default interface InventoryCheck extends Timestamp {
  id: string;
  productId: string;
  employeeId: string;
  quantityConfirmed: number;
  shelfId: string;
  status: number;
  date: number;
}

// Interface for the entire stock checks object
export interface InventoryCheckCollection extends Timestamp {
  data: InventoryCheck
}
