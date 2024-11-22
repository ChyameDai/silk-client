import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CustomerOrder } from '../../../../models/order.model';
import { OrdersService } from '../../../../services/orders.service';
import { slideInOut } from '../../../../slide.animation.tigger';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  animations: [slideInOut]
})
export class OrdersComponent {
  orders: CustomerOrder[] = [];
  selectedOrder: CustomerOrder | null = null;
  loading = false;
  currentPage = 0;
  hasMoreOrders = true;
  private destroy$ = new Subject<void>();

  @ViewChild('ordersList') ordersList!: ElementRef;
  @ViewChild('orderDetails') orderDetails!: ElementRef;

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.loadInitialOrders();
    this.subscribeToSelectedOrder();
  }
focusToDetails() {
    //bring user focus to the order details
    this.orderDetails.nativeElement.focus();
    //scroll to the order details
    this.orderDetails.nativeElement.scrollIntoView({ behavior: 'smooth' });

  }
  unFocusDetails() {
    //bring user focus to the order list
    this.ordersList.nativeElement.focus();
    //scroll to the order list
    this.ordersList.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialOrders() {
    this.loading = true;
    this.ordersService.loadOrdersPage(0)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.orders = response.orders;
        this.hasMoreOrders = response.orders.length === 10;
        this.loading = false;
      });
  }

  private subscribeToSelectedOrder() {
    this.ordersService.selectedOrder$
      .pipe(takeUntil(this.destroy$))
      .subscribe(order => {
        this.selectedOrder = order;
      });
  }

  onScroll() {
    if (this.loading || !this.hasMoreOrders) return;

    this.loading = true;
    this.currentPage++;

    this.ordersService.loadOrdersPage(this.currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.orders = [...this.orders, ...response.orders];
        this.hasMoreOrders = response.orders.length === 10;
        this.loading = false;
      });
  }

  selectOrder(order: CustomerOrder) {
    this.ordersService.setSelectedOrder(order);
    this.focusToDetails();
  }

  backToList() {
    this.ordersService.setSelectedOrder(null);
    this.unFocusDetails();
  }

}
