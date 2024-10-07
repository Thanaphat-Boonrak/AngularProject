import { Purchase } from './../common/purchase';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private httpClient: HttpClient) {}

  private Url = 'http://localhost:8080/api/checkout/purchase';

  placeOrder(purchase:Purchase):Observable<any>{
    return this.httpClient.post<Purchase>(this.Url,purchase);
  }
}
