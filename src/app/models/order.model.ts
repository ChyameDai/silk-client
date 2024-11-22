export interface CustomerOrderItem {
  cartItemId: number;
  cartId: number;
  storeProductId: number;
  productName: string;
  storeName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface CustomerOrder {
  orderId: number;
  cartId: number;
  userId: number;
  orderDate: string; // ISO 8601 date string
  status: string; // Add other status types as needed
  totalAmount: number;
  orderItems: CustomerOrderItem[];
}

export interface CustomerOrdersResponse {
  orders: CustomerOrder[];
  totalOrderAmount: number;
}
