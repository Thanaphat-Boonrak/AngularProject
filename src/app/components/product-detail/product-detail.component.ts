import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { Cart } from '../../common/cart';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {

  product!: Product;
  constructor(
    private ProductService: ProductService,
    private route: ActivatedRoute,
    private cartservice:CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.handleProductDetails());
  }

  handleProductDetails() {
    const theProductid:number = +this.route.snapshot.paramMap.get('id')!;

    this.ProductService.getProductDetail(theProductid).subscribe(
      data => this.product = data
    )
  }

  addTocart(arg0: any) {
    const Cartitem:Cart = new Cart(arg0);
    this.cartservice.addTocart(Cartitem);
    }
}
