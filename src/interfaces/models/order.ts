export enum OrderStatusEnum {
  placed = 'placed',
  approved = 'approved',
  shipped = 'shipped',
  delivered = 'delivered',
  cancelled = 'cancelled'
}

export interface IOrder {
  id?: number;
  description: string;
  quantity: number;
  amount: number;
  currency: string;
  productID?: number;
  customerID?: number;
  status?: OrderStatusEnum;
  unitPrice?: number;
  discount?: number;
  source?: string;
  isCompleted?: boolean;

  createdDate?: Date;
  updatedDate?: Date;
}
