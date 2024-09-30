import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'path';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartDetailComponent } from './components/cart-detail/cart-detail.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

const routes: Routes = [
  {path:'checkout', component:CheckoutComponent},
  {path:'cart-detail', component:CartDetailComponent},
  {path:'products/:id', component:ProductDetailComponent},
  {path:'category/:id/:name', component:ProductComponent},
  {path:'search/:keyword', component:ProductComponent},
  {path:'category', component:ProductComponent},
  {path:'products', component:ProductComponent},
  {path:'', redirectTo:'/products',pathMatch:'full'},
  {path:'**',redirectTo:'/products',pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
