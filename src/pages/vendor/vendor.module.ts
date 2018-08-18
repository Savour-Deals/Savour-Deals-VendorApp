import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { VendorPage } from './vendor';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
  ],
  imports: [
    IonicPageModule.forChild(VendorPage),
    IonicImageLoader
  ],
})
export class VendorPageModule {}
