import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaymentInstruction, PaymentInstructionResponse } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentCache = new Map<number, PaymentInstruction[]>();
  private paymentsSubject = new BehaviorSubject<PaymentInstruction[]>([]);
  payments$ = this.paymentsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Fetches payment instructions for a specific order ID
   * @param orderId The ID of the order to fetch payments for
   * @returns Observable of PaymentInstruction array
   */
  loadPaymentInstructions(orderId: number): Observable<PaymentInstruction[]> {
    // Check cache first
    if (this.paymentCache.has(orderId)) {
      const cachedPayments = this.paymentCache.get(orderId)!;
      this.paymentsSubject.next(cachedPayments);
      return of(cachedPayments);
    }

    // If not in cache, fetch from API
    return this.http.get<PaymentInstructionResponse>(
      `${environment.apiBaseUrl}${environment.payment.getByOrderId}${orderId}`
    ).pipe(
      map(response => {
        this.paymentCache.set(orderId, response.payments);
        this.paymentsSubject.next(response.payments);
        return response.payments;
      }),
      catchError(error => {
        console.error('Error fetching payment instructions:', error);
        this.paymentsSubject.next([]);
        return of([]);
      })
    );
  }

  /**
   * Gets cached payment instructions for an order if available
   * @param orderId The ID of the order
   * @returns PaymentInstruction array or null if not cached
   */
  getCachedPayments(orderId: number): PaymentInstruction[] | null {
    return this.paymentCache.get(orderId) || null;
  }

  /**
   * Manually update the current payments subject
   * @param payments Array of payment instructions
   */
  updateCurrentPayments(payments: PaymentInstruction[]): void {
    this.paymentsSubject.next(payments);
  }

  /**
   * Clear all cached payment data
   */
  clearCache(): void {
    this.paymentCache.clear();
    this.paymentsSubject.next([]);
  }

  /**
   * Clear cached payment data for a specific order
   * @param orderId The ID of the order to clear from cache
   */
  clearOrderCache(orderId: number): void {
    this.paymentCache.delete(orderId);
    if (this.paymentCache.size === 0) {
      this.paymentsSubject.next([]);
    }
  }
}
