// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CheckOutRequest, CheckOutResponse, Notification } from '../models/app.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth-service.service';
import { NotificationService } from './notification.service';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private readonly apiUrl = `${environment.apiBaseUrl}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService:NotificationService
  ) {
    console.log('CartService initialized for API handling only');

  }
//
checkout(request: CheckOutRequest):Observable<CheckOutResponse>{
  const userId = this.authService.getUserProfile()?.id;
  if (!userId) {
    console.error('No user ID available for checkout');
    return new Observable<CheckOutResponse>();
  }
  console.log('Checking out:', request);
  return this.http.post<CheckOutResponse>(`${environment.apiBaseUrl}${environment.orders.checkout}`, request);
}

}
