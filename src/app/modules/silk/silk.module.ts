import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilkHomeComponent } from './components/silk-home/silk-home.component';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SilkRoutingModule } from './silk.routing.module';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentComponent } from './components/payment/payment.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { ShippingService } from '../../services/shipping.service';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CartService } from '../../services/cart.service';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';



@NgModule({
  declarations: [
    SilkHomeComponent,
    ProductsComponent,
    CartComponent,
    OrdersComponent,
    ProfileComponent,
    ProductDetailsComponent,
    PaymentComponent,
    ShippingComponent,
    CheckoutComponent,
    NavbarComponent,
    OrderConfirmationComponent

  ],
  imports: [
    SilkRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ShippingService,CartService],
})
export class SilkModule { }
