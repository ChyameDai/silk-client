import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaymentInstruction } from '../../../../../models/app.models';
import { PaymentService } from '../../../../../services/payment.service';

@Component({
  selector: 'app-payment-instructions',
  templateUrl: './payment-instructions.component.html',
  styleUrls: ['./payment-instructions.component.scss']
})
export class PaymentInstructionsComponent implements OnInit, OnDestroy {
   @Input() orderId!: number;

  payments: PaymentInstruction[] = [];
  isExpanded = false;
  loading = false;
  private subscription = new Subscription();

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.loadPayments();

    // Subscribe to payment updates
    this.subscription.add(
      this.paymentService.payments$.subscribe(payments => {
        this.payments = payments;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadPayments() {
    this.loading = true;
    this.subscription.add(
      this.paymentService.loadPaymentInstructions(this.orderId)
        .subscribe({
          next: () => this.loading = false,
          error: () => this.loading = false
        })
    );
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
