import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatedealPage } from './createdeal';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    CreatedealPage
  ],
  imports: [
    IonicPageModule.forChild(CreatedealPage),
    IonicImageLoader
  ],
})
export class CreatedealPageModule {}
