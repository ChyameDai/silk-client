import { Component, Input, HostListener, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NavigationItem } from '../../../../models/app.models';
import { AuthService } from '../../../../services/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnChanges {
navItems: NavigationItem[] = []; // Array of navigation items
  isMenuOpen: boolean = false; // Controls mobile menu visibility
  isMobileView: boolean = false; // Detects if viewport is mobile

  isLoginPage: boolean = false; // Track if the current route is the login page
constructor(private authService:AuthService, private acrivatedRoute: ActivatedRoute, private router: Router) {}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['navItems']) {
    this.navItems = changes['navItems'].currentValue;
  }
  if (changes['isLoginPage']) {
    this.isLoginPage = changes['isLoginPage'].currentValue;
  }
}
  ngOnInit() {


   const user= this.authService.getUserProfile();
   this.isLoginPage = user ? false : true;
    this.navItems =[      { label: 'Home', link: '/silk/home' },
      { label: 'Products', link: '/silk/products' },
      { label: 'Cart', link: '/silk/cart' },
      { label: 'Orders', link: '/silk/orders' },
      { label: 'Profile', link: '/silk/profile' },]
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  // Close the menu if the user clicks outside of it
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.isMenuOpen && !target.closest('.navbar')) {
      this.closeMenu();
    }
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 768; // Mobile breakpoint
    if (!this.isMobileView) {
      this.isMenuOpen = false; // Close sidebar in desktop view
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
