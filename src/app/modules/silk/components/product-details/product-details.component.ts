import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { Location } from '@angular/common';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { CartService } from '../../../../services/cart.service';
import { AddItemsToCartRequest, CartItem, StoreProduct } from '../../../../models/app.models';
import { AuthService } from '../../../../services/auth-service.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  // Required template properties
  product!: StoreProduct;
  loading = true;
  error: string | null = null;
  quantity = 1;
  isInCart = false;
  cartQuantity = 0;
  recentlyViewed: StoreProduct[] = [];
  showStockNotification = false;
  stockNotificationEmail = '';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private location: Location,
    private auth: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];

    this.loadProductDetails(productId);
    this.loadRecentlyViewed();
    this.checkCartStatus(productId);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private checkCartStatus(productId: number): void {
    const subscription = this.cartService.loadCart().pipe(
      tap(cart => {
        const cartItem: CartItem | undefined = cart.items.products.find(item => item.storeProductId === productId);
        this.isInCart = cartItem ? cartItem.storeProductId === this.product.storeProductId : false;
        this.cartQuantity = cart.totalCartAmount
      }),
      catchError(error => {
        console.error('Error loading cart status:', error);
        return of(null);
      })
    ).subscribe();

    this.subscriptions.add(subscription);
  }

  loadProductDetails(id: number): void {
    this.loading = true;
    this.error = null;

    this.productService.getProductDetails(id).pipe(
      tap((response: any) => {
        if (response?.storeProducts?.length > 0) {
          this.product = response.storeProducts[0];


          this.addToRecentlyViewed(this.product);
          this.checkCartStatus(id); // Refresh cart status when product loads
        } else {
          throw new Error('Product not found');
        }
      }),
      catchError(error => {
        this.notificationService.showNotification('error', 'Error loading product');
        this.error = this.getErrorMessage(error);
        console.error('Error loading product:', error);
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe();
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.quantityAvailable) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    const addItemRequest: AddItemsToCartRequest = {
      userId: this.auth.getUserProfile()?.id || 0,
      status: 'current',
      items: [{
        storeProductId: this.product.storeProductId,
        quantity: this.quantity
      }]
    };

    const subscription = this.cartService.addToCart(addItemRequest).pipe(
      tap(() => {
        console.log('Product added to cart:', this.product.productName);
        this.isInCart = true;
        this.cartQuantity = this.quantity;
        this.quantity = 1; // Reset quantity after adding
        this.notificationService.showNotification('success', 'Product added to cart');
      }),
      catchError(error => {
        this.notificationService.showNotification('error', 'Error adding to cart');
        console.error('Error adding to cart:', error);
        return of(null);
      })
    ).subscribe();

    this.subscriptions.add(subscription);
  }

  updateCartQuantity(change: number): void {
    if (!this.product) return;

    const newQuantity = this.cartQuantity + change;
    if (newQuantity > 0 && newQuantity <= this.product.quantityAvailable) {
      const updateItem: AddItemsToCartRequest = {
        userId: this.auth.getUserProfile()?.id || 0,
        status: 'current',
        items: [{
          storeProductId: this.product.storeProductId,
          quantity: newQuantity
        }]
      };

      const subscription = this.cartService.updateQuantity(updateItem).pipe(
        tap(() => {
          console.log('Updated quantity in cart:', newQuantity);
          this.cartQuantity = newQuantity;
        }),
        catchError(error => {
          console.error('Error updating quantity:', error);
          return of(null);
        })
      ).subscribe();

      this.subscriptions.add(subscription);
    }
  }

  removeFromCart(storeProductId: number): void {
    const subscription = this.cartService.removeMultipleItems([storeProductId]).pipe(
      tap(() => {
        console.log('Product removed from cart:', storeProductId);
        this.isInCart = false;
        this.cartQuantity = 0;
      }),
      catchError(error => {
        console.error('Error removing product from cart:', error);
        return of(null);
      })
    ).subscribe();

    this.subscriptions.add(subscription);
  }

  subscribeToStockNotification(): void {
    if (this.product && this.stockNotificationEmail) {
      console.log('Stock notification subscription:', {
        product: this.product.productName,
        email: this.stockNotificationEmail
      });
      this.showStockNotification = false;
      this.stockNotificationEmail = '';
    }
  }

  private addToRecentlyViewed(product: StoreProduct): void {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updatedRecent = [product, ...recentlyViewed.filter((p: StoreProduct) =>
      p.storeProductId !== product.storeProductId
    )].slice(0, 5);
    localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
    this.recentlyViewed = updatedRecent;
  }

  private loadRecentlyViewed(): void {
    this.recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  }

  goBack(): void {
    this.location.back();
  }

  private getErrorMessage(error: any): string {
    if (error.status === 404) {
      return 'Product not found';
    } else if (error.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    return 'An error occurred while loading the product. Please try again later.';
  }
}
