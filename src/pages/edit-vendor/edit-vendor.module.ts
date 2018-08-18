import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { EditVendorPage } from './edit-vendor';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    EditVendorPage
  ],
  imports: [
    IonicPageModule.forChild(EditVendorPage),
    IonicImageLoader
  ],
})
export class EditVendorPageModule {}
