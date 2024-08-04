import type Timestamp from './Timestamp.interface';

export default interface Product extends Timestamp {
  productId: string;
  name: string;
  description: string;
  image: string;
  categoryId: Array<string>;
  shelves: Array<string>;
  price: number;
  sku: string;
  status: number;
  quantity: number;
}
