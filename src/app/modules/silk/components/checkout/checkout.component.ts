import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../services/cart.service';
import { CreateShippingAddressRequest, CartResponse, PaymentDetails } from '../../../../models/app.models';
import { ShippingAddress } from '../../../../models/app.models';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart!: CartResponse;
  totalAmount: number = 0;
  selectedShippingAddressId: number | null = null;
  isNewShippingAddress: boolean = false;
  newAddress: CreateShippingAddressRequest | null = null;
  paymentDetails!: PaymentDetails;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.cartService.loadCart().subscribe(cartData => {
      this.cart = cartData[0];
      this.calculateTotal();
    });
  }

  private calculateTotal(): void {
    this.totalAmount = this.cart.items.products.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );
  }

  onShippingAddressSelected(addressId: any): void {
    this.selectedShippingAddressId = addressId;
    this.isNewShippingAddress = false;
  }

  onNewShippingAddressCreated(newAddress: CreateShippingAddressRequest): void {
    this.newAddress = newAddress;
    this.isNewShippingAddress = true;
  }

  onPaymentConfirmed(paymentDetails: any): void {
    this.paymentDetails = paymentDetails;
  }

  finalizeOrder(): void {
    if (this.paymentDetails && (this.selectedShippingAddressId || this.newAddress)) {
      const orderRequest = {
        cartId: this.cart.cartId,
        totalAmount: this.totalAmount,
        paymentMethodId: this.paymentDetails.methodId,
        shippingAddressId: this.selectedShippingAddressId || 0,
        isNewShippingAddress: this.isNewShippingAddress,
        newAddress: this.isNewShippingAddress ? this.newAddress : null
      };

      console.log('Final Order:', orderRequest);
      // Add logic to send orderRequest to your backend
    } else {
      console.warn('Order could not be completed. Missing payment or shipping info.');
    }
  }
}
