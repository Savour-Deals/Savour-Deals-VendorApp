//angular
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpClientModule,HttpClient } from '@angular/common/http';

//native
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Device } from '@ionic-native/device';
import { Facebook } from '@ionic-native/facebook';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { EmailComposer } from '@ionic-native/email-composer';

//etc.
import { IonicImageLoader } from 'ionic-image-loader';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { MyApp } from './app.component';

//providers
import { VendorsProvider } from '../providers/vendors/vendors';
import { DealsProvider } from '../providers/deals/deals';

//pages
import { DealsPage } from '../pages/deals/deals';
import { HomePage } from '../pages/home/home';
import { MainPage } from '../pages/main/main';
import { RegisterPage } from '../pages/register/register';
import { VendorPage } from '../pages/vendor/vendor';
import { ViewdealPage } from '../pages/viewdeal/viewdeal';
import { CreatedealPage } from '../pages/createdeal/createdeal';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegisterPage,
    VendorPage,
    MainPage,
    DealsPage,
    ViewdealPage,
    CreatedealPage
   ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    HttpClientModule,
    AngularFireAuthModule,
    IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    VendorPage,
    MainPage,
    DealsPage,
    ViewdealPage,
    CreatedealPage
  ],
  providers: [
    StatusBar,
    InAppBrowser,
    SplashScreen,
    AngularFireDatabase,
    Facebook,
    EmailComposer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VendorsProvider,
    DealsProvider
  ]
})
export class AppModule {}
