import { CartService } from './../../services/cart.service';
import { Cart } from './../../common/cart';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.css',
})
export class CartDetailComponent implements OnInit {
removeFromCart: any;

  cartItems: Cart[] = [];
  totalPrice = 0;
  totalQuantity = 0;
  constructor(private cart: CartService) {}

  ngOnInit() {
    this.ListProduct();
  }
  ListProduct() {
    this.cartItems = this.cart.CartItems;

    this.cart.totalQuantity.subscribe((data) => (this.totalQuantity = data));

    this.cart.totalPrice.subscribe((data) => (this.totalPrice = data));
  }

  remove(cartitem: Cart) {
      this.cart.remove(cartitem);
  }
  incrementQuantity(cartitem: Cart) {
    this.cart.addTocart(cartitem);
  }

  decrementQuantity(cartitem: Cart) {
      this.cart.decrementQuantity(cartitem);
    }
}
