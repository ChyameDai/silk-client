// selector-box.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface SelectorOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-selector-box',
  templateUrl: './selector-box.component.html',
  styleUrls: ['./selector-box.component.scss']
})
export class SelectorBoxComponent {
  @Input() options: SelectorOption[] = []; // Array of options to select from
  @Input() placeholder: string = 'Select an option'; // Placeholder text
  @Output() selectionChange = new EventEmitter<any>(); // Emit selected value

  selectedLabel: string = ''; // Displayed selected label
  isOpen: boolean = false; // Controls dropdown visibility

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: SelectorOption) {
    this.selectedLabel = option.label;
    this.selectionChange.emit(option.value);
    this.isOpen = false; // Close dropdown after selection
  }
}
