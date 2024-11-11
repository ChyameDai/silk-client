// src/app/modules/shared/components/notification/notification.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  @Input() visible: boolean = false; // Controls visibility of the notification
  @Input() type: 'success' | 'warning' | 'failure' = 'success'; // Notification type
  @Input() message: string = ''; // Message to display in the notification

  @Output() close = new EventEmitter<void>(); // Close event to notify parent

  onClose() {
    this.close.emit(); // Emit the close event when close button is clicked
  }
}
