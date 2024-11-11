import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-input-box',
  templateUrl: './text-input-box.component.html',
  styleUrls: ['./text-input-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputBoxComponent),
      multi: true,
    },
  ],
})
export class TextInputBoxComponent implements ControlValueAccessor {
  @Input() placeholder: string = ''; // Placeholder text
  @Input() type: string = 'text'; // Input type (text, email, password, etc.)
  @Input() label: string = ''; // Label text
  @Input() errorMessage: string = ''; // Optional error message for validation
  @Input() isInvalid: boolean = false; // Boolean flag to show/hide error

  // Internal property to hold the input value
  value: string = '';

  // Register the change and touch callbacks
  onChange = (value: string) => {};
  onTouched = () => {};

  // Called when the input value changes
  onInputChange(event: any): void {
    this.value = event.target.value;
    this.onChange(this.value); // Notify Angular about the change
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optional method to handle the disabled state
  }
}
