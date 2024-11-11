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
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SilkHomeComponent,
    ProductsComponent,
    CartComponent,
    OrdersComponent,
    ProfileComponent,
    ProductDetailsComponent
  ],
  imports: [
    SilkRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
  ]
})
export class SilkModule { }
