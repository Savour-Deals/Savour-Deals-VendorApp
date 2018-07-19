import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewdealPage } from './viewdeal';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
  ],
  imports: [
    IonicPageModule.forChild(ViewdealPage),
    IonicImageLoader
  ],
})
export class ViewdealPageModule {}
