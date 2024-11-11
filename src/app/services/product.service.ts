import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface ProductCache {
  [key: string]: CacheItem<any>;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private cache: ProductCache = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  private readonly CACHE_KEYS = {
    PRODUCTS_LIST: 'products_list',
    PRODUCT_DETAILS: (id: number) => `product_details_${id}`,
    PRODUCT_SEARCH: (query: string) => `product_search_${query}`,
  };

  constructor(private http: HttpClient) {
    // Optional: Clear cache when service is initialized
    this.clearExpiredCache();
  }

  getProducts(): Observable<any> {
    const cacheKey = this.CACHE_KEYS.PRODUCTS_LIST;
    const cachedData = this.getFromCache<any>(cacheKey);

    if (cachedData) {
      console.log('Returning cached products list');
      return of(cachedData);
    }

    return this.http.get<any>(`${environment.apiBaseUrl}${environment.products.list}`).pipe(
      tap(response => this.addToCache(cacheKey, response)),
      shareReplay(1),
      catchError(error => {
        console.error('Error fetching products:', error);
        return this.handleError(error);
      })
    );
  }

  getProductDetails(id: number): Observable<Product> {
    const cacheKey = this.CACHE_KEYS.PRODUCT_DETAILS(id);
    const cachedData = this.getFromCache<Product>(cacheKey);

    if (cachedData) {
      console.log(`Returning cached details for product ${id}`);
      return of(cachedData);
    }

    return this.http.get<Product>(
      `${environment.apiBaseUrl}${environment.products.details}${id}`
    ).pipe(
      tap(response => this.addToCache(cacheKey, response)),
      shareReplay(1),
      catchError(error => {
        console.error(`Error fetching product ${id}:`, error);
        return this.handleError(error);
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    // Only cache if query is not empty
    if (query.trim()) {
      const cacheKey = this.CACHE_KEYS.PRODUCT_SEARCH(query);
      const cachedData = this.getFromCache<Product[]>(cacheKey);

      if (cachedData) {
        console.log(`Returning cached search results for "${query}"`);
        return of(cachedData);
      }

      return this.http.get<Product[]>(
        `${environment.apiBaseUrl}${environment.products.search}?q=${query}`
      ).pipe(
        tap(response => this.addToCache(cacheKey, response)),
        shareReplay(1),
        catchError(error => {
          console.error(`Error searching products with query "${query}":`, error);
          return this.handleError(error);
        })
      );
    }

    // If query is empty, return empty array
    return of([]);
  }

  // Cache management methods
  private addToCache<T>(key: string, data: T): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
  }

  private getFromCache<T>(key: string): T | null {
    const cachedItem = this.cache[key];

    if (!cachedItem) {
      return null;
    }

    const isExpired = Date.now() - cachedItem.timestamp > this.CACHE_DURATION;

    if (isExpired) {
      console.log(`Cache expired for key: ${key}`);
      delete this.cache[key];
      return null;
    }

    return cachedItem.data;
  }

  clearCache(): void {
    console.log('Clearing entire product cache');
    this.cache = {};
  }

  private clearExpiredCache(): void {
    const now = Date.now();
    Object.keys(this.cache).forEach(key => {
      if (now - this.cache[key].timestamp > this.CACHE_DURATION) {
        delete this.cache[key];
      }
    });
  }

  // Force refresh methods
  forceRefreshProducts(): Observable<any> {
    const cacheKey = this.CACHE_KEYS.PRODUCTS_LIST;
    delete this.cache[cacheKey];
    return this.getProducts();
  }

  forceRefreshProductDetails(id: number): Observable<Product> {
    const cacheKey = this.CACHE_KEYS.PRODUCT_DETAILS(id);
    delete this.cache[cacheKey];
    return this.getProductDetails(id);
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 403:
          errorMessage = 'Access denied';
          break;
        case 0:
          errorMessage = 'Unable to connect to server';
          break;
        default:
          errorMessage = `Server error: ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  // Cache information methods for debugging
  getCacheInfo(): { [key: string]: { age: number; expired: boolean } } {
    const now = Date.now();
    const cacheInfo: { [key: string]: { age: number; expired: boolean } } = {};

    Object.keys(this.cache).forEach(key => {
      const age = now - this.cache[key].timestamp;
      cacheInfo[key] = {
        age: Math.round(age / 1000), // age in seconds
        expired: age > this.CACHE_DURATION
      };
    });

    return cacheInfo;
  }
}
