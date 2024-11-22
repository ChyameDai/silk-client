import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SilkHomeComponent } from './components/silk-home/silk-home.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { AboutComponent } from './components/about/about.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { OffersComponent } from './components/offers/offers.component';
import { SupportComponent } from './components/support/support.component';
import { NewarrivalsComponent } from './components/newarrivals/newarrivals.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
{
    path: '',
    component: SilkHomeComponent,
    children: [
      { path: 'products', component: ProductsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'profile', component: ProfileComponent },
      {path:'home', component: HomeComponent},
      {path:"store-product/:id", component: ProductDetailsComponent},
      {path:"checkout", component: CheckoutComponent},
      {path:'confirmation', component: OrderConfirmationComponent},
      { path: 'offers', component: OffersComponent }, // New Offers Section
      { path: 'new-arrivals', component: NewarrivalsComponent }, // New Arrivals
      { path: 'categories', component: CategoriesComponent }, // Shop by Categories
      { path: 'about', component: AboutComponent }, // About or Brand Story
      { path: 'support', component: SupportComponent }, // Customer Support/FAQ
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
