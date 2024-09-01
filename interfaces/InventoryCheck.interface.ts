import type Timestamp from "./Timestamp.interface";

// Interface for a single stock check entry
export default interface ScanCheck {
  id: string;
  productId: string;
  employeeId: string;
  quantityConfirmed: number;
  shelfId: string;
  status: number;
  date: number;
}

export interface InventoryCheck extends Timestamp {
  id: string;
  name: string;
  data: Record<string, ScanCheck>;
}

// Interface for the entire stock checks object
export interface InventoryCheckCollection extends Timestamp {
  data: Record<string, InventoryCheck>
}
