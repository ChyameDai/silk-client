import { Component, HostListener, OnInit } from '@angular/core';
import { AddItemRequest, AddItemsToCartRequest, UserProduct } from '../../../../models/app.models';
import { ProductService } from '../../../../services/product.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../services/auth-service.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: UserProduct[] = [];
  loading: boolean = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 5;
  isLoadingMore: boolean = false; // For loading spinner at the bottom
  allProductsLoaded: boolean = false; // To prevent further loading when no more products are available

  constructor(private productService: ProductService, private router: Router,
     private cartService:CartService,
     private notificationService : NotificationService,
     private authService:AuthService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }
  fetchProducts(): void {
    if (this.loading || this.isLoadingMore || this.allProductsLoaded ) return; // Prevent multiple requests

    this.isLoadingMore = true;
    this.productService.getProductsPaginated(this.currentPage, this.pageSize).pipe(
      finalize(() => {
        this.loading = false;
        this.isLoadingMore = false;
      })
    ).subscribe(
      (response: any) => {
        if (response && response.products) {
          this.products = [...this.products, ...response.products]; // Accumulate products

          if (response.products.length < this.pageSize) {
            this.allProductsLoaded = true; // Stop loading if no more products are available
          } else {
            this.currentPage++; // Move to the next page
          }
        } else {
          this.error = 'Invalid response format';
          console.error('Invalid response format:', response);
        }
      },
      (error) => {
        this.error = this.getErrorMessage(error);
        console.error('Error fetching products:', error);
      }
    );
  }

  // Scroll event listener to detect when the user scrolls to the bottom
  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !this.loading && !this.allProductsLoaded) {
      this.fetchProducts(); // Load next page
    }
  }

  onProductAction(product: UserProduct, actionType: string): void {
    console.log('button pressed', actionType);
    console.log('Product action clicked:', product);

    switch (actionType) {
      case 'Add to Cart':
        // Implement add to cart logic
       const newItem : AddItemsToCartRequest = {

     userId: this.authService.getUserProfile()?.id || 0,
     status: 'current',
     items: [
        {
          storeProductId: product.productId,
          quantity: 1
        }
      ]

        };



        this.cartService.addToCart(newItem).subscribe(
          (response: any) => {

            console.log('Product added to cart:', response);
            this.notificationService.showNotification('success', 'Product added to cart');

          }
        );

        break;
      case 'View Details':
   // {path:"store-product/:id", component: ProductDetailsComponent},
   //navigate
   this.router.navigate([`silk/store-product/${product.productId}`]);
   break;
    }
  }

  convertStringPriceToNumber(price: any): number {
    // If price is already a number, return it
    if (typeof price === 'number') {
      return price;
    }

    // If price is undefined or null, return 0
    if (!price) {
      console.warn('Price is undefined or null');
      return 0;
    }

    try {
      // Ensure price is a string and clean it
      const cleanedPrice = price.toString().replace(/[^0-9.-]+/g, '');
      const numericPrice = parseFloat(cleanedPrice);

      if (isNaN(numericPrice)) {
        console.warn(`Invalid price format: ${price}`);
        return 0;
      }

      return numericPrice;
    } catch (error) {
      console.error('Error converting price:', error);
      return 0;
    }
  }

  private getErrorMessage(error: any): string {
    if (error.status === 404) {
      return 'Products not found';
    } else if (error.status === 403) {
      return 'You do not have permission to view these products';
    } else if (error.status === 0) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    return 'An error occurred while loading products. Please try again later.';
  }

  // Track function for better performance
  trackByProductId(index: number, product: UserProduct): string | number {
    return product.productId || index;
  }
}
