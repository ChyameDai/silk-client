import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  storeName: string = '';
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //get Store name from local storage
    this.storeName = localStorage.getItem('storeName') || '';
    // Check if user is logged in
    this.user = this.authService.getUserProfile();

    if (!this.user) {
      this.authService.logout();
    }
  }

  /**
   * Navigates to the specified route
   * @param route Target route to navigate to
   */
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}


