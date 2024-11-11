import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ButtonComponent } from './components/button/button.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { GenericCardComponent } from './components/generic-card/generic-card.component';
import { TextInputBoxComponent } from './components/text-input-box/text-input-box.component';
import { SelectorBoxComponent } from './components/selector-box/selector-box.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ModalComponent } from './components/modal/modal.component';
import { ErrorStateComponent } from './components/error-state/error-state.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';



@NgModule({
  declarations: [

    ButtonComponent,
    ProductCardComponent,
    GenericCardComponent,
    TextInputBoxComponent,
    SelectorBoxComponent,
    NotificationComponent,
    ModalComponent,
    ErrorStateComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [

    ButtonComponent,
    ProductCardComponent,
    GenericCardComponent,
    TextInputBoxComponent,
    SelectorBoxComponent,
    NotificationComponent,
    ModalComponent,
    ErrorStateComponent,
    LoadingSpinnerComponent
  ]
})
export class SharedModule { }
