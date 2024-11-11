import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  emailInvalid = false;
  passwordInvalid = false;
  loading = false; // New loading flag
  isMobile = false;
  constructor(private authService: AuthService,private router:Router) {}

  ngOnInit(): void {
    //detect if the user is using a mobile device
    if(window.innerWidth <= 768){
      this.isMobile = true
    }
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      // Redirect to home page or dashboard
      this.router.navigate(['/silk']);
    }


  }

  onLogin(): void {
    // Validate email and password
    this.emailInvalid = !this.validateEmail(this.email);
    this.passwordInvalid = this.password.trim() === '';

    if (this.emailInvalid || this.passwordInvalid) {
      return;
    }
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        console.log('User logged in:', user);
        // Redirect or handle successful login
        this.loading = false; // Reset loading state on success
        this.router.navigate(['/silk']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.loading = false; // Reset loading state on failure
      },
    });
  }

  // Email validation function
  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
