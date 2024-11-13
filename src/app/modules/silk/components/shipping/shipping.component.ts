import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ShippingService } from '../../../../services/shipping.service';
import { ShippingAddress } from '../../../../models/app.models';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
  addresses: ShippingAddress[] = [];
  selectedAddress?: ShippingAddress;
  newAddress: Partial<ShippingAddress> = {}; // Object to hold form data for new address

  @Output() addressSelected = new EventEmitter<ShippingAddress>(); // Emits selected address ID
  @Output() newAddressCreated = new EventEmitter<ShippingAddress>(); // Emits new address object
showAddAddressForm: any;

  constructor(private shippingService: ShippingService) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

  private loadAddresses(): void {
    this.shippingService.getAllAddresses().subscribe(
      (addresses) => {
        this.addresses = addresses;
        this.selectedAddress = addresses.find(addr => addr.isDefault) || addresses[0];
        if (this.selectedAddress) {
          this.emitAddressSelection(this.selectedAddress);
        }
      },
      (error) => console.error('Error loading addresses:', error)
    );
  }

  selectAddress(address: ShippingAddress): void {
    this.selectedAddress = address;
    this.emitAddressSelection(address);
  }

  addAddress(): void {
    if (this.newAddress.addressLine1 && this.newAddress.city && this.newAddress.state && this.newAddress.postalCode && this.newAddress.country) {
      this.shippingService.addShippingAddress(this.newAddress as ShippingAddress).subscribe(
        (addedAddress) => {
          this.addresses.push(addedAddress);
          this.selectAddress(addedAddress);
          this.newAddressCreated.emit(addedAddress); // Emit event with new address
          this.newAddress = {}; // Reset the form after submission
        },
        (error) => console.error('Error adding address:', error)
      );
    }
  }

  private emitAddressSelection(address: ShippingAddress): void {
    this.addressSelected.emit(address); // Emit the selected address ID
  }
}
