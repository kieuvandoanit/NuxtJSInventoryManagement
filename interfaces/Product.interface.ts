import type Timestamp from './Timestamp.interface';

export default interface Product extends Timestamp {
  id: string;
  name: string;
  description: string;
  note: string;
  image: string;
  categoryId: string;
  shelfId: string;
  status: number;
  quantity: number;
}

export interface ProductCollection extends Timestamp {
  data: Product
}
