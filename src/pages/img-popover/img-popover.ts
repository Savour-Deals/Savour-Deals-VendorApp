import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-img-popover',
  templateUrl: 'img-popover.html',
})

export class ImgPopoverPage {
  imgArr: any[];
  selectedIndex: number = -1;
  selectedImg: String = '';
  
  constructor(public viewCtrl: ViewController, public navParams: NavParams,public navCtrl: NavController) {
    this.imgArr = this.navParams.get('imgs');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  submit(){
    this.viewCtrl.dismiss(this.selectedImg);
  }

  select(img, idx){
    this.selectedIndex = idx;
    this.selectedImg = img;
  }

  getClass(idx){
    if (idx == this.selectedIndex){
      return "selected";
    }else{
      return "deselected"
    }
  }
}