import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides,Navbar, AlertController  } from 'ionic-angular';
import * as moment from 'moment';
import { ImagePicker } from '@ionic-native/image-picker';

/**
 * Generated class for the CreatedealPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-createdeal',
  templateUrl: 'createdeal.html',
})
export class CreatedealPage {
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Navbar) navbar: Navbar;

  rName: string;
  rID: string;

  atEnd: boolean = false;
  atFront: boolean = true;
  allDay: boolean = true;
  
  min: string = moment().format('YYYY-MM-DD');

  dealType:string;
  startDate:string;
  startTime:string;
  endDate:string;
  endTime:string;
  discount: string;
  img:string;


  dispStart:string;
  dispEnd:string;

  dealString: string;
  dealStart: number;
  dealEnd: number;
  dealDays: {
    Mon:boolean,
    Tues:boolean,
    Wed:boolean,
    Thurs:boolean,
    Fri:boolean,
    Sat:boolean,
    Sun:boolean
  } = {Mon:false,Tues:false,Wed:false,Thurs:false,Fri:false,Sat:false,Sun:false}


  discountType: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private imagePicker: ImagePicker) {
    this.discountType = "percent";
    this.dealType = "Entree";
    this.rID = this.navParams.get("ID");
    this.rName = this.navParams.get("name");
  }



  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    this.navbar.backButtonClick = () => {
      let alert = this.alertCtrl.create({
        title: 'Notice',
        subTitle: 'Deal not yet created. Leaving now will delete any progress.',
        buttons: [{
          text: 'Leave',
          role: 'destructive',
          handler: () => {
            this.navCtrl.pop();
          }
        },{
          text: 'Stay'
        }
      ]
      });
      alert.present();
    }
  }

  prevClick(){
    this.atEnd = false;
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  nextClick(){
    //Check if we can slide
    switch(this.slides.getActiveIndex()) {
      case 1: 
        if(this.discountType != "BOGO" && this.discount === undefined){
          this.presentAlert('Please select a discount to continue.');
          break;
        }
        this.slideNext();
        break;
      case 2:
        if (this.startDate > this.endDate){
          this.presentAlert('Start date can not be greator than end date.',);
          break;
        }
        if (this.startDate === undefined || this.endDate === undefined){
          this.presentAlert('Please select both a start and end date to continue.');
          break;
        }else if(!this.allDay && (this.endTime === undefined || this.startTime === undefined)){
          this.presentAlert('Please check your start and end times or select "All Day" to continue.');   
          break;
        }
        this.slideNext();
        break;
      case 3:
        var oneSelected: boolean = false;
        for (let day in this.dealDays){
          if(this.dealDays[day]){
            oneSelected = true;
            break;
          }
        }
        if(!oneSelected){
          this.presentAlert('Please select at least one day for this deal to run on.');
          break;
        }
        this.slideNext();
        break;
      case 4:
        if (this.img === undefined){
          this.presentAlert('Please select a photo.');
          break;
        }
        this.slideNext();
        break;
      default:
        this.slideNext();
    }
  }

  presentAlert(str: string){
    let alert = this.alertCtrl.create({
      title: 'Notice',
      subTitle: str,
      buttons: [{text: 'Okay'}]
    });
    alert.present();
  }

  slideNext(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  slideChanged(){
    if (this.slides.isBeginning()){
      this.atEnd = false;
      this.atFront = true;
    }else if (this.slides.isEnd()){
      this.atEnd = true;
      this.atFront = false;
      if (!this.allDay){
        this.dealStart = moment(this.startDate + "T" + this.startTime).unix();
        this.dealEnd = moment(this.endDate + "T" + this.endTime).unix();
        this.dispStart = moment(this.startDate + "T" + this.startTime).format('LLLL');
        this.dispEnd = moment(this.endDate + "T" + this.endTime).format('LLLL');
      }else{
        this.dealStart = moment(this.startDate).unix();
        this.dealEnd = moment(this.endDate).unix();
        this.dispStart = moment(this.startDate).format('LLLL');
        this.dispEnd = moment(this.endDate).format('LLLL')
      }
      if(this.discountType == "BOGO"){
        this.dealString = "Buy One Get One " + this.dealType;
      }else if (this.dealType == "Entire Order"){
          this.dealString = this.discount + " " + this.dealType;
      }else{
        this.dealString = this.discount + " One " + this.dealType;
      }
    }else{
      this.atEnd = false;
      this.atFront = false;
    }
  }

  confirmed(){
    let alert = this.alertCtrl.create({
      title: 'Confirm Deal',
      subTitle: 'Hit CONFIRM to create your new deal. Once confirmed, you will NOT be able to edit this deal!',
      buttons: [{
        text: 'No wait!'
      },{
        text: 'CONFIRM',
        role: 'destructive',
        handler: () => {
          this.navCtrl.pop();
        }
      }
    ]
    });
    alert.present();
  }

  getDiscounts(type: string){
    var deals = [];
    if (type=="percent"){
      for (let i = 4;i<=20;i++){
        deals.push(i*5 + "% Off ");
      }
    }else{
      for (let i = 2;i<=50;i++){
        deals.push("$" + i + " Off ");
      }
    }
    return deals;
  }

  getDay(day){
    return this.dealDays[day];
  }

  openGallery (): void {
    let options = {
      maximumImagesCount: 1,
      quality: 30,
      outputType: 1
    }
  
    this.imagePicker.getPictures(options).then(
      imageSource => this.img = 'data:image/jpeg;base64,'+imageSource[0],
      err => console.log('uh oh')
    );
  }


}
