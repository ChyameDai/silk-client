import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-generic-card',
  templateUrl: './generic-card.component.html',
  styleUrl: './generic-card.component.scss'
})
export class GenericCardComponent {
  @Input() title: string = 'Card Title'; // Title text for the card
  @Input() imageUrl: string = ''; // Image URL for the card
  @Input() description: string = ''; // Description text
}

