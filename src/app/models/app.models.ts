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
  productPrice  : number;
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
  items: {
    products: CartItem[];
  };
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