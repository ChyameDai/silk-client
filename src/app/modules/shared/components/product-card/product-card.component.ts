// product-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() imageUrl: string = '';
  @Input() name: string = '';
  @Input() price: number = 0;
  @Input() description: string = '';
  @Input() buttonText: string = 'Add to Cart';
  @Input() buttonText2: string = 'View Details';
  @Output() actionClick = new EventEmitter<string>();

  onActionClick(text: string) {
    this.actionClick.emit(text);
  }
}
