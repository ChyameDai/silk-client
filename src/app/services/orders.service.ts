
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, Subject, tap } from 'rxjs';
import { CheckOutRequest, CheckOutResponse, Notification } from '../models/app.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth-service.service';
import { NotificationService } from './notification.service';
import { CustomerOrdersResponse, CustomerOrder } from '../models/order.model';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private orderDetailsCache = new Map<string, any>();
  private orderSummariesCache = new Map<string, CustomerOrdersResponse>();
  private selectedOrderSubject = new BehaviorSubject<CustomerOrder | null>(null);
  private pageSize = 10;

  selectedOrder$ = this.selectedOrderSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService:NotificationService
  ) {
    console.log('CartService initialized for API handling only');

  }
  lastCheckoutResponse: CheckOutResponse | null = null;
//
checkout(request: CheckOutRequest):Observable<any>{
  const userId = this.authService.getUserProfile()?.id;
  if (!userId) {
    console.error('No user ID available for checkout');
    return new Observable<CheckOutResponse>();
  }
  console.log('Checking out:', request);
  return this.http.post<any>(`${environment.apiBaseUrl}${environment.orders.checkout}`, request).pipe(
    tap(response => {
      console.log('Checkout response:', response);
      this.notificationService.showNotification('success', 'Order placed successfully');

    }),
    catchError(error => {
      console.error('Error checking out:', error);
      this.notificationService.showNotification('error', 'Error placing order');
      this.lastCheckoutResponse = null;
      return new Observable<CheckOutResponse>();
    })
  );
}
getCheckoutResponse(): CheckOutResponse | null {
  return this.lastCheckoutResponse;
}
setCheckoutResponse(response: CheckOutResponse): void {
  this.lastCheckoutResponse = response;
};
loadOrdersPage(page: number): Observable<CustomerOrdersResponse> {
  const userId = this.authService.getUserProfile()?.id;
  if (!userId) {
    console.error('No user ID available');
    return of({ orders: [], totalOrderAmount: 0 });
  }

  const cacheKey = `${userId}-${page}-${this.pageSize}`;
  if (this.orderSummariesCache.has(cacheKey)) {
    return of(this.orderSummariesCache.get(cacheKey)!);
  }

  return this.http.get<CustomerOrdersResponse>(
    `${environment.apiBaseUrl}/api/v1/orders/userId/${userId}/${page}/${this.pageSize}`
  ).pipe(
    tap(response => {
      this.orderSummariesCache.set(cacheKey, response);
    }),
    catchError(error => {
      console.error('Error loading orders:', error);
      this.notificationService.showNotification('error', 'Error loading orders');
      return of({ orders: [], totalOrderAmount: 0 });
    })
  );
}

setSelectedOrder(order: CustomerOrder | null) {
  this.selectedOrderSubject.next(order);
}

clearCache() {
  this.orderSummariesCache.clear();
  this.orderDetailsCache.clear();
}
}


