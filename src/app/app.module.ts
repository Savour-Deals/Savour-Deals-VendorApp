import { PaymentPage } from './../pages/payment/payment';
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
import { environment as ENV } from '../environments/environment';
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
import { RootTabPage } from '../pages/root-tab/root-tab';
import { AccountPage } from '../pages/account/account';
import { StripeJsPage } from '../pages/stripe-js/stripe-js';
import { AngularFireFunctions } from 'angularfire2/functions';
import { AccountProvider } from '../providers/account/account';




@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegisterPage,
    VendorPage,
    MainPage,
    ViewdealPage,
    ImgPopoverPage,
    EditItemPage,
    RootTabPage,
    AccountPage,
    StripeJsPage,
    PaymentPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(ENV.FIREBASE_CONFIG),
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
    EditItemPage,
    RootTabPage,
    AccountPage,
    StripeJsPage,
    PaymentPage
  ],
  providers: [
    SplashScreen,
    AngularFireDatabase,
    AngularFireFunctions,
    Facebook,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VendorsProvider,
    DealsProvider,
    AppDataProvider,
    AccountProvider
  ]
})
export class AppModule {}
