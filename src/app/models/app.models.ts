export interface NavigationItem {
  label: string;
  link: string;
  icon?: string; // Optional icon field
}
export interface UserProduct {
  productId: number;
  storeProductId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  productCategory: string;
  productPrice: string; // Represent BigDecimal as a string for high precision
  storeName: string;
  storeId: number;
  quantity: number;
}
export interface CartItem {
imageUrl: any;
name: any;
  storeProductId: number;
  productName: string;
  quantity: number;
  price  : number;
  storeName: string;
}

export interface Cart {
  id?: number;  // Cart ID from backend
  items: CartItem[];
  totalAmount: number;
}
export interface StoreProduct {
  storeProductId: number;
  quantityAvailable: number;
  productName: string;
  storeName: string;
  storeId: number;
  productId: number;
  price: number;
  categoryName: string;
  categoryId: number;
  url?: string; // Optional URL field
}
export interface OrderSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  taxBreakdown: TaxBreakdown[];
}

export interface TaxBreakdown {
  type: string;
  rate: number;
  amount: number;
}

export interface AddItemsToCartRequest
{
  userId: number;
  status: string;
  items: AddItemRequest[];
}
export interface AddItemRequest {
  storeProductId: number;
  quantity: number;
  imageurl?: string;
}

// Keeping all existing interfaces unchanged
// Adding only new non-conflicting ones

export interface CartResponse {
  cartId: number;
  items: CartItem[];
  status: string;
  totalCartAmount: number;
  userId: number;
}

export interface UpdateCartItemRequest {
  cartId: number;
  storeProductId: number;
  quantity: number;
}

export interface RemoveCartItemRequest {
  cartId: number;
  cartItemId: number;
}

export interface CartOperationResponse {
  success: boolean;
  message: string;
  cart?: CartResponse;
}
export interface Notification {
  type: string
  message: string;
}
export interface ShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}
// app/models/app.models.ts

export interface CreateShippingAddressRequest {
  addressLine1: string;       // First line of the address
  addressLine2?: string;      // Optional second line of the address
  city: string;               // City for the address
  state: string;              // State or province
  postalCode: string;         // Postal or ZIP code
  country: string;            // Country name
  isDefault?: boolean;        // Flag to mark as default address, optional
}
export interface PaymentDetails {
  methodId: number; // ID for the payment method
  amount: number;
  // other properties of PaymentDetails
}
export interface PaymentsDTO {
  paymentId: number;
  orderId: number;
  paymentMethod: string;
  amount: number; // BigDecimal in Java is usually a number in TypeScript
  paymentDate: string; // LocalDateTime in Java can be a string in ISO format
}



export interface UserProductList {
  products: UserProduct[];
}

export interface Shipping {
  shippingId: number;
  userId: number;
  addressLine1: string;
  addressLine2?: string; // Optional field
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CheckOutResponse {
  orderId: number;
  userId: number;
  payment: PaymentsDTO;
  products: UserProductList;
  status: string;
  shipping: Shipping;
  errorMessages?: string; // Optional field
}


  export interface CheckOutRequest {
    cartId: number;
    totalAmount: number;
    paymentMethodId: number;
    shippingAddressId: number;
    isNewShippingAddress: boolean;
    newAddress: CreateShippingAddressRequest | null;
  }
