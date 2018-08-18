import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealsPage } from './deals';
import { IonicImageLoader } from 'ionic-image-loader';


@NgModule({
  declarations: [
    DealsPage
  ],
  imports: [
    IonicPageModule.forChild(DealsPage),
    IonicImageLoader
  ],
})
export class DealsPageModule {}
