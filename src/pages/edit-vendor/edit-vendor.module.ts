import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditVendorPage } from './edit-vendor';

@NgModule({
  declarations: [
    EditVendorPage
  ],
  imports: [
    IonicPageModule.forChild(EditVendorPage)
  ],
})
export class EditVendorPageModule {}
