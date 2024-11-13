import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth-service.service';
import { AddItemsToCartRequest, CartResponse } from '../models/app.models';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly apiUrl = `${environment.apiBaseUrl}`;
  private cartCache: CartResponse | null = null; // Cache for the cart
  private cacheValid = false; // Indicates if cache is valid

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    console.log('CartService initialized with caching');
  }

  loadCart(): Observable<CartResponse> {
    if (this.cacheValid && this.cartCache) {
      console.log('Returning cached cart data');
      return of(this.cartCache);
    }

    const userId = this.authService.getUserProfile()?.id;
    if (!userId) {
      console.warn('No user ID available for cart loading');
      return throwError(() => new Error('No user ID available'));
    }

    return this.http.get<CartResponse>(`${this.apiUrl}${environment.cart.get}${userId}`).pipe(
      tap(response => {
        console.log('Cart loaded from API:', response);
        this.cartCache = response; // Cache the response
        this.cacheValid = true;    // Set cache as valid
      }),
      catchError(error => {
        console.error('Error loading cart:', error);
        return throwError(() => error);
        //if you get error 400 , that means there is no cart for the user handle it accordingly

      })
    );
  }

  addToCart(newItem: AddItemsToCartRequest): Observable<Boolean> {
    const userId = this.authService.getUserProfile()?.id;
    if (!userId) {
      console.error('No user ID available for adding to cart');
      return throwError(() => new Error('No user ID'));
    }

    return this.http.post<Boolean>(`${this.apiUrl}${environment.cart.add}`, newItem).pipe(
      tap(response => {
        response
          ? this.notificationService.showNotification('success', 'Product Added to cart')
          : this.notificationService.showNotification('failure', 'Failed to add product');
        if (response) {
          this.cacheValid = false; // Invalidate cache
          // update the cart value from server
          this.loadCart().subscribe();
        }
      }),
      catchError(error => {
        console.error('Error adding to cart:', error);
        this.notificationService.showNotification('failure', `Failed to add product ${error}`);
        return throwError(() => error);
      })
    );
  }

  updateQuantity(request: AddItemsToCartRequest): Observable<Boolean> {
    return this.http.post<Boolean>(`${this.apiUrl}${environment.cart.update}`, request).pipe(
      tap(response => {
        response
          ? this.notificationService.showNotification('success', 'Product quantity updated')
          : this.notificationService.showNotification('failure', 'Failed to update quantity');
        if (response) {
          this.cacheValid = false; // Invalidate cache
        }
      }),
      catchError(error => {
        console.error('Error updating quantity:', error);
        this.notificationService.showNotification('failure', `Failed to update quantity ${error}`);
        return throwError(() => error);
      })
    );
  }

  removeMultipleItems(storeProductIds: number[]): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/items`, {
      body: { storeProductIds }
    }).pipe(
      tap(response => {
        console.log('Multiple items removed:', response);
        this.cacheValid = false; // Invalidate cache after removing items
      }),
      catchError(error => {
        console.error('Error removing multiple items:', error);
        return throwError(() => error);
      })
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`).pipe(
      tap(() => {
        console.log('Cart cleared');
        this.cartCache = null; // Clear cache
        this.cacheValid = false; // Invalidate cache
      }),
      catchError(error => {
        console.error('Error clearing cart:', error);
        return throwError(() => error);
      })
    );
  }

  getCartTotal(): Observable<number> {
    return this.loadCart().pipe(
      map(cartResponse => cartResponse.totalCartAmount),
      tap(total => console.log('Total cart amount:', total)),
      catchError(error => {
        console.error('Error calculating cart total:', error);
        return throwError(() => error);
      })
    );
  }

  getItemCount(): Observable<number> {
    return this.loadCart().pipe(
      map(cartResponse => cartResponse.items.products.reduce((sum, cartItem) => sum + cartItem.quantity, 0)),
      tap(total => console.log('Total items in cart:', total)),
      catchError(error => {
        console.error('Error calculating item count:', error);
        return throwError(() => error);
      })
    );
  }
}
