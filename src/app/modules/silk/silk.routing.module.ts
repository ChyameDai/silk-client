import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SilkHomeComponent } from './components/silk-home/silk-home.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

const routes: Routes = [
  {
    path: '',
    component: SilkHomeComponent,
    children: [
      { path: 'products', component: ProductsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'profile', component: ProfileComponent },
      {path:'home', component: SilkHomeComponent},
      {path:"store-product/:id", component: ProductDetailsComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full' } // Default route
    ]
  },
  { path: '**', redirectTo: '' } // Wildcard to redirect to SilkHome
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SilkRoutingModule { }
