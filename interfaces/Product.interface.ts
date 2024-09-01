import type Timestamp from './Timestamp.interface';

export default interface Product extends Timestamp {
  id: string;
  name: string;
  description: string;
  note: string;
  image: string;
  categoryId: string;
  shelfId: string;
  status: ProductStatus;
  quantity: number;
}

export enum ProductStatus {
  ENABLE = 0,
  DISABLE = 1
}

export interface ProductCollection extends Timestamp {
  data: Product
}
