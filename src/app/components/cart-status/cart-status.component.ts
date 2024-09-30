import { Cart } from './../../common/cart';
import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit{
    totalPrice:number = 0;
    totalQuantity:number = 0;

    constructor(private Cart:CartService){
    }

    ngOnInit(): void {
        this.updateCartstatus();
    }

    updateCartstatus(){
        this.Cart.totalPrice.subscribe(
          data => this.totalPrice = data
        )

        this.Cart.totalQuantity.subscribe(
          data => this.totalQuantity = data
        )

    }

}
