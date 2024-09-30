import { CartService } from './../../services/cart.service';
import { Cart } from './../../common/cart';
import { Product } from './../../common/product';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName: string = "";
  search: boolean = false;
  thePagenumber: number = 1;
  thePagesize: number = 5;
  theTotalElements: number = 0;
  thePreviousCategory: number = 1;
  thepreviouskeyword: string = "";

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartservice:CartService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.search = this.route.snapshot.paramMap.has('keyword');
    if (this.search) {
      this.handleSearchProduct();
    } else {
      this.handleListProduct();
    }
  }
  handleSearchProduct() {
    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;
    if (this.thepreviouskeyword != theKeyWord) {
      this.thePagenumber = 1;
    }
    this.thepreviouskeyword = theKeyWord;

    this.productService
      .SearchProductPaginate(
        this.thePagenumber - 1,
        this.thePagesize,
        theKeyWord
      )
      .subscribe(this.theProcess());
  }

  handleListProduct() {
    const Categoryid: boolean = this.route.snapshot.paramMap.has('id')!;

    if (Categoryid) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if (this.thePreviousCategory != this.currentCategoryId) {
      this.thePagenumber = 1;
    }
    this.thePreviousCategory = this.currentCategoryId;

    this.productService
      .getProductPaginate(
        this.thePagenumber - 1,
        this.thePagesize,
        this.currentCategoryId
      )
      .subscribe(this.theProcess());
  }

  changepagesize(pagesize: string) {
    this.thePagesize = +pagesize;
    this.thePagenumber = 1;
    this.listProducts();
  }

  theProcess() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePagenumber = data.page.number + 1;
      this.thePagesize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addTocart(product: Product) {
    const theCartItem = new Cart(product);
    this.cartservice.addTocart(theCartItem);
    }
}
