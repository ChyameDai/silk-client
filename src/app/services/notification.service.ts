// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notification } from '../models/app.models';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  showNotification(type: string, message: string): void {
    this.notificationSubject.next({ type, message });
  }
}
