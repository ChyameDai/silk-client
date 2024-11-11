import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../services/auth-service.service';
import { CartResponse, CartItem, AddItemsToCartRequest } from '../../../../models/app.models';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  public cart: CartResponse | null = null;
  public groupedItems: any[] = [];
  public totalAmount: number = 0;
  public totalItemCount: number = 0;
  public quickCheckoutAvailable: boolean = false;
  public selectedItems: Set<number> = new Set();
  public shippingCost: number = 0;
  public totalTax: number = 0;
  public taxBreakdown: { type: string; rate: number; amount: number }[] = [];
  public isExpanded: boolean = true;  // State for expandable content
  isLoading: boolean = false;
  @ViewChild('cartSidebar') private cartSidebar!: ElementRef<HTMLElement>;
  private subscriptions: Subscription = new Subscription();

  private readonly TAX_RATES = {
    STATE: 0.0625,
    COUNTY: 0.01,
    CITY: 0.005
  } as const;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    const subscription = this.cartService.loadCart().pipe(
      tap((cartResponses: CartResponse[]) => {
        this.isLoading = false;
        this.cart = cartResponses[0];
        if (this.cart) {
          this.quickCheckoutAvailable = this.cart.items.products.length > 0;
          this.groupedItems = this.groupItemsByStore(this.cart.items.products);
          this.totalAmount = this.cart.totalCartAmount;
          this.totalItemCount = this.calculateTotalItemCount(this.cart.items.products);
          this.calculateOrderSummary();
        }
      }),
      catchError(error => {
        this.isLoading = false;
        console.error('Error loading cart:', error);
        return of(null);
      })
    ).subscribe();

    this.subscriptions.add(subscription);
  }

  private groupItemsByStore(items: CartItem[]): any[] {
    return Object.values(
      items.reduce((acc: { [key: string]: any }, item: CartItem) => {
        const store = item.storeName || 'Unknown Store';
        if (!acc[store]) {
          acc[store] = { store, items: [], subtotal: 0, tax: 0 };
        }
        acc[store].items.push(item);
        acc[store].subtotal += (item.productPrice || 0) * (item.quantity || 0);
        acc[store].tax = this.calculateTotalTax(acc[store].subtotal);
        return acc;
      }, {})
    );
  }

  private calculateTotalTax(amount: number): number {
    return amount * (this.TAX_RATES.STATE + this.TAX_RATES.COUNTY + this.TAX_RATES.CITY);
  }

  private calculateTotalItemCount(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  private calculateOrderSummary(): void {
    this.totalTax = this.calculateTotalTax(this.totalAmount);
    this.taxBreakdown = [
      { type: 'State Tax', rate: this.TAX_RATES.STATE, amount: this.totalAmount * this.TAX_RATES.STATE },
      { type: 'County Tax', rate: this.TAX_RATES.COUNTY, amount: this.totalAmount * this.TAX_RATES.COUNTY },
      { type: 'City Tax', rate: this.TAX_RATES.CITY, amount: this.totalAmount * this.TAX_RATES.CITY }
    ];
    this.shippingCost = this.totalAmount >= 35 ? 0 : 5.99;
  }

  updateQuantity(storeProductId: number, quantity: number): void {
    this.isLoading = true;
    if (quantity < 0 || !this.cart) return;
     //update quantity local
    const item = this.cart.items.products.find(item => item.storeProductId === storeProductId);
   //update quantity local cart
    if (item) {
      item.quantity = quantity;
    }
//update other calculations
    this.totalAmount = this.cart.items.products.reduce((sum, item) => sum + (item.productPrice || 0) * (item.quantity || 0), 0);
    this.totalItemCount = this.calculateTotalItemCount(this.cart.items.products);
    this.calculateOrderSummary();





    const updateRequest: AddItemsToCartRequest = {
      userId: this.authService.getUserProfile()?.id || 0,
      status: 'current',
      items: [{ storeProductId, quantity }]
    };



    const subscription = this.cartService.updateQuantity(updateRequest).pipe(
      tap(() => this.loadCart()), // Refresh cart after update
      catchError(error => {
        console.error('Error updating quantity:', error);
        this.isLoading = false;
        return of(null);
      })
    ).subscribe();

    this.subscriptions.add(subscription);
  }

  toggleItemSelection(storeProductId: number): void {
    if (this.selectedItems.has(storeProductId)) {
      this.selectedItems.delete(storeProductId);
    } else {
      this.selectedItems.add(storeProductId);
    }
  }

  moveToWishlist(storeProductIds: number[]): void {
    console.log(`Moving items ${storeProductIds} to wishlist`);
    // Logic for moving to wishlist (implementation depends on business logic)
  }

  handleQuantityChange(event: any, storeProductId: number): void {
    const newQuantity = Number(event.target.value);
    this.updateQuantity(storeProductId, newQuantity);
  }

  moveSelectedToWishlist(): void {
    const selectedItemsArray = Array.from(this.selectedItems);
    this.selectedItems.clear();
    this.cartService.removeMultipleItems(selectedItemsArray).subscribe({
      next: () => this.loadCart(),
      error: error => console.error('Error moving items to wishlist:', error)
    });
  }

  quickCheckout(): void {
    this.router.navigate(['/checkout'], { queryParams: { mode: 'quick' } })
      .catch(error => console.error('Navigation error:', error));
  }

  shareCart(): void {
    navigator.clipboard.writeText(window.location.href).catch(err => {
      console.error('Failed to copy cart URL:', err);
    });
  }

  toggleExpansion(): void {
    this.isExpanded = !this.isExpanded;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
