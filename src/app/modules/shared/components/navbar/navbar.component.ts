import { Component, Input, HostListener, OnInit } from '@angular/core';
import { NavigationItem } from '../../../../models/app.models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() navItems: NavigationItem[] = []; // Array of navigation items
  isMenuOpen: boolean = false; // Controls mobile menu visibility
  isMobileView: boolean = false; // Detects if viewport is mobile

  ngOnInit() {
    this.checkViewport();
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
}
