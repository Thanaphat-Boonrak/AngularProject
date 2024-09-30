import { Component, OnInit } from '@angular/core';
import { Category } from '../../common/category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-prodeuct-category',
  templateUrl: './prodeuct-category.component.html',
  styleUrl: './prodeuct-category.component.css',
})
export class ProdeuctCategoryComponent implements OnInit {
  productCategories!: Category[];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => this.productCategories = data
    )
  }
}
