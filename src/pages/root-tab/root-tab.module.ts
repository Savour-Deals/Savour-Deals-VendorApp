import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RootTabPage } from './root-tab';

@NgModule({
  declarations: [
    RootTabPage,
  ],
  imports: [
    IonicPageModule.forChild(RootTabPage),
  ],
})
export class RootTabPageModule {}
