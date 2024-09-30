import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { Category } from '../common/category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {



  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProduct(thecategoryid:number): Observable<Product[]> {

    const SearchUrl = `${this.baseUrl}/search/findByCategoryId?id=${thecategoryid}`;

    return this.httpClient.get<GetResponseProducts>(SearchUrl).pipe(
      map(response => response._embedded.products)
    )
  }

  getProductCategories(): Observable<Category[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  SearchProduct(theKeyWord: string) {
    const SearchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;

    return this.httpClient.get<GetResponseProducts>(SearchUrl).pipe(
      map(response => response._embedded.products)
    )
  }

  getProductDetail(theProductid: number): Observable<Product> {
      const productUrl = `${this.baseUrl}/${theProductid}`;

      return this.httpClient.get<Product>(productUrl)
  }

  getProductPaginate(thepage:number,pagesize:number,thecategoryid:number): Observable<GetResponseProducts> {

    const SearchUrl = `${this.baseUrl}/search/findByCategoryId?id=${thecategoryid}`
    + `&page=${thepage}&size=${pagesize}`;

    return this.httpClient.get<GetResponseProducts>(SearchUrl)
  }

  SearchProductPaginate(thepage:number,pagesize:number,theKeyWord:string): Observable<GetResponseProducts> {
    const SearchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`
    + `&page=${thepage}&size=${pagesize}`;

    return this.httpClient.get<GetResponseProducts>(SearchUrl)
  }


}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: Category[];
  },

}

