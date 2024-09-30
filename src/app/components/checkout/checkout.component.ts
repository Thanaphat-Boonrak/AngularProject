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
    private shop: ShopFormService
  ) {}

  ngOnInit() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidator.notonlyWhitespace
        ]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2),ShopValidator.notonlyWhitespace]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+*]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
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
}
function firstName() {
  throw new Error('Function not implemented.');
}
