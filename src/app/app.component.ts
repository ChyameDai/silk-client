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

        console.log('User:', user);
        if (user.role ==='client' || user.role ==='store') {
          this.router.navigate(['/silk/products']);
        }
          else{
            this.router.navigate(['/login']);
          }

        }



  }
  ngOnDestroy(): void {
      this.authService.logout();
  }
}
