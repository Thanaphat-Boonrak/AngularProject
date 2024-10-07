import { Cart } from "./cart";

export class OrderItem {

  imageUrl:string;
  unitPrice:number;
  quantity:number;
  productId:string;

  constructor(public CartItem:Cart){
    this.imageUrl =CartItem.imageUrl
    this.unitPrice = CartItem.unitPrice
    this.quantity = CartItem.quantity
    this.productId = CartItem.id

  }

}
