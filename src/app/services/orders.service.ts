
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap } from 'rxjs';
import { CheckOutRequest, CheckOutResponse, Notification } from '../models/app.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth-service.service';
import { NotificationService } from './notification.service';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {


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

}
