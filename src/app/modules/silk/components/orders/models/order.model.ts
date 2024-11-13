// Order-related user interface
interface OrderUser {
    userId: number;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: string | null;
  }
  
  // Order-related cart interface
  interface OrderCart {
    cartId: number;
    user: OrderUser;
    createdAt: string;
    status: string;
  }
  
  // Order base details
  interface OrderBaseDetails {
    orderId: number;
    cart: OrderCart;
    user: OrderUser;
    orderDate: string;
    status: string;
  }
  
  // Order shipping information
  interface OrderShippingDetails extends Shipping {
    order: OrderBaseDetails;
    shippingDate: string;
    estimatedDeliveryDate: string;
  }
  
  // Order product details
  interface OrderProductDetails {
    productId: number;
    storeProductId: number;
    productName: string;
    productDescription: string | null;
    productImage: string | null;
    productCategory: string;
    productPrice: number;
    storeName: string;
    storeId: number;
    quantity: number;
  }
  
  // Order products container
  interface OrderProductList {
    products: OrderProductDetails[];
  }
  
  // Complete order response
  export interface OrderDetailResponse extends CheckOutResponse {
    shipping: OrderShippingDetails;
    products: OrderProductList;
    payment: PaymentsDTO;
    orderId: number;
    userId: number;
    status: string;
    errorMessages: string | null;
  }
  
  // Optional: Type guard
  export function isOrderDetailResponse(obj: any): obj is OrderDetailResponse {
    return (
      obj &&
      typeof obj.orderId === 'number' &&
      typeof obj.userId === 'number' &&
      obj.payment &&
      obj.products?.products &&
      Array.isArray(obj.products.products) &&
      obj.shipping &&
      typeof obj.status === 'string'
    );
  }
  
  // Optional: Order status type for better type safety
  export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';