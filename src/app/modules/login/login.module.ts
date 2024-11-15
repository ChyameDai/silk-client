import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgorPasswordComponent } from './components/forgor-password/forgor-password.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login.routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [LoginComponent,RegisterComponent,ForgorPasswordComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class LoginModule { }
