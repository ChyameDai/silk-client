// modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() visible: boolean = false; // Control modal visibility
  @Output() closeModal = new EventEmitter<void>(); // Event emitter for closing modal

  onClose() {
    this.closeModal.emit();
  }
}
