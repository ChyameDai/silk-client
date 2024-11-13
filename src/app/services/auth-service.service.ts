// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NavigationItem } from '../models/app.models';
import { Router } from '@angular/router';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  private authStatus = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatus.asObservable();

  private userProfile = new BehaviorSubject<UserProfile | null>(null);
  userProfile$ = this.userProfile.asObservable();

  constructor(private http: HttpClient,private router : Router) {}

  login(email: string, password: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiBaseUrl}${environment.auth.login}${email}`).pipe(
      tap((user: UserProfile) => {
        this.authStatus.next(true);
        this.userProfile.next(user);
        localStorage.setItem(environment.storage.authToken, JSON.stringify(user));

      })
    );
  }

  logout(): void {
    this.authStatus.next(false);
    this.userProfile.next(null);
    localStorage.removeItem(environment.storage.authToken);
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);

  }

  getUserProfile(): UserProfile | null {
    const user = localStorage.getItem(environment.storage.authToken);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return this.authStatus.getValue();
  }
  logOut(): void {
    this.authStatus.next(false);
    this.userProfile.next(null);
    localStorage.removeItem(environment.storage.authToken);
    this.router.navigate(['/login']);
  }







}
