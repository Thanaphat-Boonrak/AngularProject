import { ShopValidator } from './../../validators/shop-validator';
import { start } from 'repl';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ShopFormService } from '../../services/shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { response } from 'express';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  CreditCardMonth: number[] = [];
  CreditCardYear: number[] = [];
  countries: Country[] = [];
  shippingAddress: State[] = [];
  billingAddress: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private shop: ShopFormService,
    private cart: CartService,
    private checkOut: CheckoutService,
    private router: Router
  ) {}

  ngOnInit() {
    this.reviewCart();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidator.notonlyWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidator.notonlyWhitespace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+*]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidator.notonlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidator.notonlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidator.notonlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidator.notonlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidator.notonlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidator.notonlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidator.notonlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('([0-9]{4}-){3}[0-9]{4}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;
    this.shop
      .getCreditCardMonth(startMonth)
      .subscribe((data) => (this.CreditCardMonth = data));
    this.shop
      .getCreditCardYear()
      .subscribe((data) => (this.CreditCardYear = data));

    this.shop.getCountries().subscribe((data) => (this.countries = data));
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get street() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get city() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get state() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get country() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get zipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get streetbillingAddress() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get citybillingAddress() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get statebillingAddress() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get countrybillingAddress() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get zipCodebillingAddress() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get CreditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get CreditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get CreditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get CreditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event: Event) {
    const evenchecked = (event.target as HTMLInputElement).value;
    if (evenchecked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingAddress = this.shippingAddress;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddress = [];
    }
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();

    }
    else{
    let order = new Order(this.totalPrice, this.totalQuantity);

    const cartItems = this.cart.CartItems;

    let orderItemsShort: OrderItem[] = cartItems.map(
      (temp) => new OrderItem(temp)
    );

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress?.state)
    );
    const shippingCountry: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress?.country)
    );
    purchase.shippingAddress!.state = shippingState.name;
    purchase.shippingAddress!.country = shippingCountry.name;

    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress?.state)
    );
    const billingCountry: State = JSON.parse(
      JSON.stringify(purchase.billingAddress?.country)
    );
    purchase.billingAddress!.state = billingState.name;
    purchase.billingAddress!.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItemsShort;
    this.restCart();
    this.checkOut.placeOrder(purchase).subscribe({
      next: response =>{
        alert(`Your Order Success, This your Trackking id${response.orderTrackingNumber}`)
      },
      error: error=>{
        alert(`error: ${error.message}`)
      }
    });
  }
  }
  restCart() {
    this.cart.CartItems = [];
    this.cart.totalPrice.next(0);
    this.cart.totalQuantity.next(0);

    this.checkoutFormGroup.reset;

    this.router.navigateByUrl("/products");
  }

  handleMonthAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const CurrentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup!.value.expirationYear
    );

    let startmonth: number;

    if (CurrentYear == selectedYear) {
      startmonth = new Date().getMonth() + 1;
    } else {
      startmonth = 1;
    }

    this.shop
      .getCreditCardMonth(startmonth)
      .subscribe((data) => (this.CreditCardMonth = data));
  }

  getstate(formGroupname: string) {
    const formgroup = this.checkoutFormGroup.get(formGroupname);
    const countryCode = formgroup?.value.country.code;

    this.shop.getCountriesState(countryCode).subscribe((data) => {
      if (formGroupname === 'shippingAddress') {
        this.shippingAddress = data;
      } else {
        this.billingAddress = data;
      }
      formgroup?.get('state')?.setValue(data[0]);
    });
  }

  onCardInput(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    input = input.match(/.{1,4}/g)?.join('-') || '';
    event.target.value = input;
  }

  reviewCart() {
    this.cart.totalPrice.subscribe((data) => (this.totalPrice = data));

    this.cart.totalQuantity.subscribe((data) => (this.totalQuantity = data));
  }
}
