import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth-service.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-silk-home',
  templateUrl: './silk-home.component.html',
  styleUrls: ['./silk-home.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
})
export class SilkHomeComponent implements OnInit {
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
