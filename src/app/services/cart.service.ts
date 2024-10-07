import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Cart } from '../common/cart';
import { BehaviorSubject, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  CartItems: Cart[] = [];
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  storage: Storage | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = localStorage;
      let data = JSON.parse(this.storage.getItem('CartItems')!);
      if (data != null) {
        this.CartItems = data;
        this.computeTotal();
      }
    }
  }

  addTocart(theCartItem: Cart) {
    let alreadyExistingInCart = false;
    let existingInCart: Cart | undefined;

    if (this.CartItems.length > 0) {
      existingInCart = this.CartItems.find(
        (temp) => temp.id === theCartItem.id
      );
    }
    alreadyExistingInCart = existingInCart != undefined;
    if (alreadyExistingInCart) {
      existingInCart!.quantity++;
    } else {
      this.CartItems.push(theCartItem);
    }

    this.computeTotal();
  }
  computeTotal() {
    let totalPriceValue: number = 0;
    let totalQuatityValue: number = 0;

    for (let temp of this.CartItems) {
      totalPriceValue += temp.unitPrice * temp.quantity;
      totalQuatityValue += temp.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuatityValue);
    this.pesisitCartItem();
  }

  pesisitCartItem() {
    this.storage!.setItem('CartItems', JSON.stringify(this.CartItems));
  }

  decrementQuantity(cartitem: Cart) {
    cartitem.quantity--;
    if (cartitem.quantity == 0) {
      this.remove(cartitem);
    }else{
      this.computeTotal();
    }
  }
  remove(cartitem: Cart) {
    const itemindex = this.CartItems.findIndex(temp => temp.id === cartitem.id)

    if(itemindex > -1){
        this.CartItems.splice(itemindex,1);
        this.computeTotal();
    }
  }
}
