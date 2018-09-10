import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StripeJsPage } from './stripe-js';

@NgModule({
  declarations: [
    StripeJsPage,
  ],
  imports: [
    IonicPageModule.forChild(StripeJsPage),
  ],
})
export class StripeJsPageModule {}
