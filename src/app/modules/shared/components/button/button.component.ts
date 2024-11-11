import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})

export class ButtonComponent implements OnChanges {
  @Input() type: 'primary' | 'secondary' | 'danger' = 'primary'; // Button type input
  @Input() text: string = 'Click me'; // Button text input
  @Input() disabled: boolean = false; // Button disabled sthate

  ngOnChanges(changes:SimpleChanges):void {
  //update all the inputs

  if(changes['type']) {
    this.type = changes['type'].currentValue;
  }
  if(changes['text']) {
    this.text = changes['text'].currentValue;
  }
  if(changes['disabled']) {
    this.disabled = changes['disabled'].currentValue;
  }
  }
}
