import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth-service.service';

@Component({
  selector: 'app-silk-home',
  templateUrl: './silk-home.component.html',
  styleUrl: './silk-home.component.scss'
})
export class SilkHomeComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    //check if user is logged in
    const user = this.authService.getUserProfile();
    if(!user){
      this.authService.logout();
    }


  }




}
