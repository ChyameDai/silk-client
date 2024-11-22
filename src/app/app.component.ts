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
storeUrl!: string;
  constructor(private router: Router, private route: ActivatedRoute,private authService:AuthService) {}

  ngOnInit(): void {

    //capture query params and store them in storeUrl, and store in local storage
    this.route.queryParams.subscribe(params => {
      this.storeUrl = params['storeUrl'];
      if (this.storeUrl) {
        console.log('Store URL:', this.storeUrl);
        localStorage.setItem('storeName', this.storeUrl);
        const user = this.authService.getUserProfile();
      if(user){

        console.log('User:', user);
        if (user.role ==='client' || user.role ==='store') {
          this.router.navigate(['/silk/products']);
        }
          else{
            this.router.navigate(['/login']);
          }

        }


      }

    });
    //comment and example of how to pass query params to a route from the browser
    //http://localhost:4200/login?storeUrl=http://localhost:4200/silk/products
    // Define the navigation items for the app
      //check if user is logged in


  }
  ngOnDestroy(): void {
      this.authService.logout();
  }
}
