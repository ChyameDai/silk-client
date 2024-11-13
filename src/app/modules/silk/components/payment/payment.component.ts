// payment.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface PaymentDetails {
  method: string;
  amount: string |number;
  cardHolderName?: string;
  cardNumber?: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  @Input() amount!: number; // Payment amount passed from the parent
  @Output() paymentConfirmed = new EventEmitter<PaymentDetails>(); // Emits payment confirmation to parent

  paymentForm: FormGroup;
  selectedPaymentMethod: 'creditCard' | 'crypto' | 'applePay' | 'paypal' | 'cashApp' = 'creditCard';

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expirationDate: ['', [Validators.required, Validators.pattern('(0[1-9]|1[0-2])/(\\d{2})')]], // MM/YY
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      cardHolderName: ['', Validators.required],
    });
  }

  onSelectPaymentMethod(method: 'creditCard' | 'crypto' | 'applePay' | 'paypal' | 'cashApp'): void {
    this.selectedPaymentMethod = method;
  }

  onSubmit(): void {
    if (this.paymentForm.valid && this.selectedPaymentMethod === 'creditCard') {
      const paymentDetails: PaymentDetails = {
        method: this.selectedPaymentMethod,
        amount: this.amount.toPrecision(2) ,
        cardHolderName: this.paymentForm.value.cardHolderName,
        cardNumber: this.paymentForm.value.cardNumber,
      };
      console.log('Processing credit card payment:', paymentDetails);
      this.paymentConfirmed.emit(paymentDetails); // Emit payment confirmation with details
    }
  }
}
