// app.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationItem } from './models/app.models';
import { AuthService } from './services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit , OnDestroy{
  isLoginPage: boolean = false; // Track if the current route is the login page
navItems!: NavigationItem[];

  constructor(private router: Router, private route: ActivatedRoute,private authService:AuthService) {}

  ngOnInit(): void {
    // Define the navigation items for the app
      //check if user is logged in
      const user = this.authService.getUserProfile();
      if(user){
        this.navItems = this.authService.getUserNavItems();
        console.log(user);

        this.navItems = [
          { label: 'Home', link: '/silk/home' },
          { label: 'Products', link: '/silk/products' },
          { label: 'Cart', link: '/silk/cart' },
          { label: 'Orders', link: '/silk/orders' },
          { label: 'Profile', link: '/silk/profile' },

        ];
        this.router.navigate(['/silk']);

      }
      else{
        this.navItems = [
          { label: 'Login', link: '/login' },
          { label: 'Register', link: '/login/register' },
        ];
        this.router.navigate(['/login']);
      }



  }
  ngOnDestroy(): void {
      this.authService.logout();
  }
}
