import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorPage } from './vendor';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    VendorPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorPage),
    IonicImageLoader
  ],
})
export class VendorPageModule {}
