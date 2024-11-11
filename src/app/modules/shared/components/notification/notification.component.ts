// src/app/modules/shared/components/notification/notification.component.ts
import { Component, OnInit } from '@angular/core';
;
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../services/notification.service';
import { Notification } from '../../../../models/app.models';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  visible = false;
  type: 'success' | 'warning' | 'failure'| string = 'success';
  message = '';
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe((notification: Notification) => {
      this.type = notification.type;
      this.message = notification.message;
      this.visible = true;

      // Hide the notification automatically after a few seconds
      setTimeout(() => {
        this.visible = false;
      }, 3000);
    });
  }

  onClose(): void {
    this.visible = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
