import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CheckOutResponse } from '../../../../models/app.models';
import { OrdersService } from '../../../../services/orders.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit, OnChanges {
order!: CheckOutResponse;
constructor(
  private orderService: OrdersService,
) { }
  ngOnInit(): void {
    this.order = this.orderService.lastCheckoutResponse ? this.orderService.lastCheckoutResponse : {} as CheckOutResponse;
    console.log(this.order);
  }
  ngOnChanges(): void {
    this.order = this.orderService.lastCheckoutResponse ? this.orderService.lastCheckoutResponse : {} as CheckOutResponse;

  }

  getStatusClass(): string {
    const status = this.order.status.toLowerCase();
    return `status-${status}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

}
