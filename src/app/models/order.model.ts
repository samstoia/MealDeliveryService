import { OrderItem } from './orderItem.model';

export class Order {
  constructor (public orderKey: string,
               public orderUserKey: string,
               public orderDateTime: Date = new Date(),
               public deliveryDateTime: Date = new Date(),
               public restaurantKey: string,
               public orderItems: OrderItem[],
               public totalCost: number) {}
}
