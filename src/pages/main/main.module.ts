import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { MainPage } from './main';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
  ],
  imports: [
    IonicPageModule.forChild(MainPage),
    IonicImageLoader
  ],
})
export class MainPageModule {}
