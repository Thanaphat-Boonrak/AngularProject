import { State } from './../common/state';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { start } from 'repl';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class ShopFormService {
  private coutriesUrl = 'http://localhost:8080/api/countries';
  private stateUrl = 'http://localhost:8080/api/states';
  constructor(private httpclient: HttpClient) {}
  getCreditCardMonth(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    for (let i = startMonth; i <= 12; i++) {
      data.push(i);
    }
    return of(data);
  }

  getCreditCardYear(): Observable<number[]> {
    let data: number[] = [];

    const startyear: number = new Date().getFullYear();
    const endyear: number = startyear + 10;

    for (let theyear = startyear; theyear <= endyear; theyear++) {
      data.push(theyear);
    }

    return of(data);
  }

  getCountries(): Observable<Country[]> {
    return this.httpclient
      .get<GetResponseCountrie>(this.coutriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  getCountriesState(Countryname:string): Observable<State[]> {
    const SearchUrl = `${this.stateUrl}/search/findByCountryCode?code=${Countryname}`;
    return this.httpclient
      .get<GetResponseStates>(SearchUrl)
      .pipe(map((response) => response._embedded.states));
  }
}

interface GetResponseCountrie {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  };
}
