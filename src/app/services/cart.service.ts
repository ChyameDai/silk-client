import { Notification } from './../models/app.models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth-service.service';
import { AddItemRequest, AddItemsToCartRequest, CartResponse } from '../models/app.models';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly apiUrl = `${environment.apiBaseUrl}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService:NotificationService
  ) {
    console.log('CartService initialized for API handling only');
  }

  loadCart(): Observable<CartResponse[]> {
    const userId = this.authService.getUserProfile()?.id;
    if (!userId) {
      console.warn('No user ID available for cart loading');
      return throwError(() => new Error('No user ID available'));
    }

    return this.http.get<CartResponse[]>(`${this.apiUrl}${environment.cart.get}${this.authService.getUserProfile()?.id}`).pipe(
      tap(response =>

        console.log('Cart loaded from API:', response)),


      catchError(error => {
        console.error('Error loading cart:', error);
        return throwError(() => error);
      })
    );
  }

  addToCart(newItem: AddItemsToCartRequest): Observable<Boolean> {
    const userId = this.authService.getUserProfile()?.id;
    if (!userId) {
      console.error('No user ID available for adding to cart');
      return throwError(() => new Error('No user ID'));
    }
    console.log('Adding to cart:', newItem);
    return this.http.post<Boolean>(`${environment.apiBaseUrl}${environment.cart.add}`, newItem).pipe(
      tap(response =>response?
        this.notificationService.showNotification('sucess','Product Added to cart'):
        this.notificationService.showNotification('failure','Failed to add product')

      ),
      catchError((error) => {
        console.error('Error adding to cart:', error);
        this.notificationService.showNotification('failure',`Failed to add product ${error}` )
        return throwError(() => error);
      })
    );
  }

  updateQuantity(request: AddItemsToCartRequest): Observable<Boolean> {
    return this.http.post<Boolean>(`${environment.apiBaseUrl}${environment.cart.update}`, request).pipe(
      tap(response =>response?
        this.notificationService.showNotification('sucess','Product Added to cart'):
        this.notificationService.showNotification('failure','Failed to add product')

      ),
      catchError((error) => {
        this.notificationService.showNotification('failure',`Failed to add product ${error}` )
        return throwError(() => error);
      })
    );
  }

  removeMultipleItems(storeProductIds: number[]): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/items`, {
      body: { storeProductIds }
    }).pipe(
      tap(response => console.log('Multiple items remove response:', response)),
      catchError((error) => {
        console.error('Error removing multiple items:', error);
        return throwError(() => error);
      })
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`).pipe(
      tap(() => console.log('Cart cleared')),
      catchError((error) => {
        console.error('Error clearing cart:', error);
        return throwError(() => error);
      })
    );
  }

  getCartTotal(userId: string): Observable<number> {
    return this.loadCart().pipe(
      map(cartResponses => cartResponses[0].totalCartAmount),
      tap(total => console.log('Total cart amount:', total)),
      catchError((error) => {
        console.error('Error calculating cart total:', error);
        return throwError(() => error);
      })
    );
  }

  getItemCount(userId: string): Observable<number> {
    return this.loadCart().pipe(
      map(cartResponses => cartResponses[0].items.products.reduce((sum, cart) => sum + cart.quantity, 0)),
      tap(total => console.log('Total items in cart:', total)),
      catchError((error) => {
        console.error('Error calculating cart total:', error);
        return throwError(() => error
        );
      })
    );




  }
}
