import { Injectable } from '@angular/core';
import { start } from 'repl';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  constructor() { }
  getCreditCardMonth(startMonth:number):Observable<number[]>{
    let data:number[] = [];
      for(let i = startMonth; i <= 12; i++){
        data.push(i);
      }
      return of(data)
  }

  getCreditCardYear():Observable<number[]>{
    let data:number[] = [];

    const startyear:number = new Date().getFullYear();
    const endyear:number =startyear + 10

    for(let theyear = startyear; theyear <= endyear; theyear++){
      data.push(theyear);
    }

    return of(data)
  }
}
