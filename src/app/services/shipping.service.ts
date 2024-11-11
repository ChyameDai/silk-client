// app/core/services/shipping.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ShippingAddress } from '../models/app.models';
import { AuthService } from './auth-service.service';


interface CacheData<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private readonly baseUrl = environment.apiBaseUrl // Replace with your base URL
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Cache storage using BehaviorSubject
  private addressesCache$ = new BehaviorSubject<CacheData<ShippingAddress[]> | null>(null);
  private defaultAddressCache$ = new BehaviorSubject<CacheData<ShippingAddress> | null>(null);

  // Endpoints
  private readonly endpoints = {
    allAddresses: '/api/v1/user/get-all-shipping-addresses/',
    defaultAddress: '/api/v1/user/add-shipping-address/',
    addAddress: '/api/orders/add-shipping-address'
  };

  constructor(private http: HttpClient,private authService:AuthService) {}

  /**
   * Get all shipping addresses with caching
   */
  getAllAddresses(): Observable<ShippingAddress[]> {
    const cached = this.addressesCache$.value;

    if (this.isCacheValid(cached)) {
      return cached ? of(cached.data) : of([]);
    }

    return this.http.get<ShippingAddress[]>(`${this.baseUrl}${this.endpoints.allAddresses}${this.authService.getUserProfile()?.id}`)
      .pipe(
        tap(addresses => {
          this.addressesCache$.next({
            data: addresses,
            timestamp: Date.now()
          });
        }),
        catchError(error => {
          console.error('Error fetching addresses:', error);
          return cached ? of(cached.data) : of([]);
        }),
        shareReplay(1)
      );
  }

  /**
   * Add default shipping address and update cache
   */
  addDefaultAddress(address: ShippingAddress): Observable<ShippingAddress> {
    return this.http.post<ShippingAddress>(`${this.baseUrl}${this.endpoints.defaultAddress}${this.authService.getUserProfile()?.id}`, address)
      .pipe(
        tap(newAddress => {
          // Update default address cache
          this.defaultAddressCache$.next({
            data: newAddress,
            timestamp: Date.now()
          });

          // Update addresses cache if it exists
          const cachedAddresses = this.addressesCache$.value;
          if (cachedAddresses) {
            const updatedAddresses = [...cachedAddresses.data, newAddress];
            this.addressesCache$.next({
              data: updatedAddresses,
              timestamp: Date.now()
            });
          }
        }),
        shareReplay(1)
      );
  }

  /**
   * Add new shipping address and update cache
   */
  addShippingAddress(address: ShippingAddress): Observable<ShippingAddress> {
    return this.http.post<ShippingAddress>(`${this.baseUrl}${this.endpoints.addAddress}${this.authService.getUserProfile()?.id}`, address)
      .pipe(
        tap(newAddress => {
          // Update addresses cache if it exists
          const cachedAddresses = this.addressesCache$.value;
          if (cachedAddresses) {
            const updatedAddresses = [...cachedAddresses.data, newAddress];
            this.addressesCache$.next({
              data: updatedAddresses,
              timestamp: Date.now()
            });
          }
        }),
        shareReplay(1)
      );
  }

  /**
   * Clear all caches - useful for logout or force refresh
   */
  clearCache(): void {
    this.addressesCache$.next(null);
    this.defaultAddressCache$.next(null);
  }

  /**
   * Force refresh all addresses - bypasses cache
   */
  forceRefresh(): Observable<ShippingAddress[]> {
    this.addressesCache$.next(null);
    return this.getAllAddresses();
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(cache: CacheData<any> | null): boolean {
    if (!cache) return false;
    const now = Date.now();
    return now - cache.timestamp < this.CACHE_DURATION;
  }
}
