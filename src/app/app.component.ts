import { Component } from '@angular/core';
import { Platform } from 'ionic-angular/umd';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  isDesktop:boolean = false;

  constructor(platform: Platform, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      splashScreen.hide();
    });
    if (platform.is('core')) {
      // This will only print when on desktop
      console.log("I'm in a desktop!");
      this.isDesktop = true;
    }
  }
}

