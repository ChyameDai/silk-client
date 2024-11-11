import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faGoogle, faWhatsapp, faApple, faFacebook } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  // Font Awesome icons
  faGoogle = faGoogle;
  faWhatsapp = faWhatsapp;
  faApple = faApple;
  faFacebook = faFacebook;
  isMobile = false;

  constructor(private fb: FormBuilder) {

    //detect if the user is using a mobile device
    if(window.innerWidth <= 768){
      this.isMobile = true
    }
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Register Form Data:', this.registerForm.value);
    }
  }

  loginWithGoogle() {
    console.log('Login with Google');
  }

  loginWithWhatsApp() {
    console.log('Login with WhatsApp');
  }

  loginWithApple() {
    console.log('Login with Apple');
  }

  loginWithOther() {
    console.log('Login with Facebook');
  }
}
