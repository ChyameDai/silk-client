import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CustomerOrder } from '../../../../../models/order.model';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {

  @Input() order!: CustomerOrder;
  @Output() back = new EventEmitter<void>();

  onBack() {
    this.back.emit();
  }
}
