import { CheckOutResponse } from './../../../../models/app.models';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../services/cart.service';
import { CreateShippingAddressRequest, CartResponse, PaymentDetails, CheckOutRequest } from '../../../../models/app.models';
import { ShippingAddress } from '../../../../models/app.models';
import { OrdersService } from '../../../../services/orders.service';
import { NotificationService } from '../../../../services/notification.service';
import { Router } from '@angular/router';


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
  checkOutResponse : CheckOutResponse | null = null;
  isCheckOutSuccess: boolean = false;
  isLoading: boolean = false;

  constructor(private cartService: CartService,
    private orderService: OrdersService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.cartService.loadCart().subscribe(cartData => {
      this.cart = cartData;
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
    this.selectedShippingAddressId = addressId.addressId;
    this.isNewShippingAddress = false;
  }

  onNewShippingAddressCreated(newAddress: CreateShippingAddressRequest): void {
    this.newAddress = newAddress;
    this.isNewShippingAddress = true;
  }

  onPaymentConfirmed(paymentDetails: any): void {
    this.paymentDetails = paymentDetails;
    //set payment id based on payment method
    this.isLoading = true;
    if (paymentDetails.method === 'creditCard') {

      this.paymentDetails.methodId = 1;
    }
    console.log('Payment Details:', paymentDetails);
    this.finalizeOrder();
  }

  finalizeOrder(): void {
    if (this.paymentDetails && (this.selectedShippingAddressId || this.newAddress)) {
      const orderRequest: CheckOutRequest = {
        cartId: this.cart.cartId,
        totalAmount: this.totalAmount,
        paymentMethodId: this.paymentDetails.methodId,
        shippingAddressId: this.selectedShippingAddressId || 0,
        isNewShippingAddress: this.isNewShippingAddress,
        newAddress: this.isNewShippingAddress ? this.newAddress : null
      };
this.orderService.checkout(orderRequest).subscribe(response => {
      this.checkOutResponse = response;
      console.log('Order placed:', response);
      this.isCheckOutSuccess = true;
      this.isLoading = false;
      this.orderService.setCheckoutResponse(response);
      this.notificationService.showNotification('success', 'Order placed successfully');
      this.router.navigate(['/silk/confirmation']);
      this.cartService.loadCart().subscribe(() => {

      });
    });


      // Add logic to send orderRequest to your backend
    } else {
      this.isLoading = false;
      console.warn('Order could not be completed. Missing payment or shipping info.');
    }
  }
}
