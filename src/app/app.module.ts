//angular
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpClientModule } from '@angular/common/http';

//native
import { SplashScreen } from '@ionic-native/splash-screen';
import { Facebook } from '@ionic-native/facebook';

//etc.
import { IonicImageLoader } from 'ionic-image-loader';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { MyApp } from './app.component';

//providers
import { VendorsProvider } from '../providers/vendors/vendors';
import { DealsProvider } from '../providers/deals/deals';

//pages
import { HomePage } from '../pages/home/home';
import { MainPage } from '../pages/main/main';
import { RegisterPage } from '../pages/register/register';
import { VendorPage } from '../pages/vendor/vendor';
import { ViewdealPage } from '../pages/viewdeal/viewdeal';

import { DealsPageModule } from '../pages/deals/deals.module';
import { CreatedealPageModule } from '../pages/createdeal/createdeal.module';
import { EditVendorPageModule } from '../pages/edit-vendor/edit-vendor.module';
import { AppDataProvider } from '../providers/app-data/app-data';
import { ImgPopoverPage } from '../pages/img-popover/img-popover';
import { EditItemPage } from '../pages/edit-item/edit-item';




@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegisterPage,
    VendorPage,
    MainPage,
    ViewdealPage,
    ImgPopoverPage,
    EditItemPage
   ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    HttpClientModule,
    AngularFireAuthModule,
    IonicImageLoader.forRoot(),
    AngularFirestoreModule,
    AngularFireStorageModule,
    CreatedealPageModule,
    EditVendorPageModule,
    DealsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    VendorPage,
    MainPage,
    ViewdealPage,
    ImgPopoverPage,
    EditItemPage
  ],
  providers: [
    SplashScreen,
    AngularFireDatabase,
    Facebook,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VendorsProvider,
    DealsProvider,
    AppDataProvider
  ]
})
export class AppModule {}
