import { Component, ViewChild } from '@angular/core';
import { IonicPage, ViewController, NavParams, Slides,Navbar, AlertController, Platform, LoadingController  } from 'ionic-angular';
import * as moment from 'moment';
import { AngularFireStorage } from 'angularfire2/storage';
import { DealsProvider } from '../../providers/deals/deals';
import { finalize } from 'rxjs/operators';

const randomId = Math.random().toString(36).substring(2);


@IonicPage()
@Component({
  selector: 'page-createdeal',
  templateUrl: 'createdeal.html',
})
export class CreatedealPage {
  newDeal = { StartTime: 0,
    EndTime: 0,
    rID: '',
    photo: '',
    rName: '',
    dealDesc: '',
    activeDays: { Mon: false, Tues: false, Wed: false, Thurs: false, Fri: false, Sat: false, Sun : false }
  };

  loaded: boolean = false;
  startedUpload: boolean = false;
  uploadState: any;
  downloadURL: any;
  uploadProgress: any;
  mobile: boolean;
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Navbar) navbar: Navbar;

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
  discountOf: string;
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
  } = { Mon:true, Tues:true, Wed:true, Thurs:true, Fri:true, Sat:true, Sun:true}

  imgArr: string[] = [ 
    //Entrees
    "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=be3aa106f944edc77c68fcd567c22bbb&auto=format&fit=crop&w=975&q=80",
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5975de9b79eb7aedb931f2cfc414e8c6&auto=format&fit=crop&w=2100&q=80",
    "https://images.unsplash.com/photo-1518133683791-0b9de5a055f0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4781be90642c42b730426f5c08522a8e&auto=format&fit=crop&w=2100&q=80",
    "https://images.unsplash.com/photo-1488530814214-bc796945ecc3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7cf0cf3eece75775337afb3c8495c157&auto=format&fit=crop&w=2100&q=80",
    "https://images.unsplash.com/photo-1449785227466-10687c63e194?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=507e6ca0f324d075de0b9561d2ea4547&auto=format&fit=crop&w=2389&q=80",
    //Appetizer
    "https://images.unsplash.com/photo-1516407019386-e27ad4597cf6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d8f2ff4a55ceb8218f7053b763b2ac64&auto=format&fit=crop&w=2284&q=80",
    "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a6b1386fcbb7de1689a980078691c939&auto=format&fit=crop&w=975&q=80",
    "https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f3641419b8bafb4c5d1bf2c7f9eb57e7&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1522946962233-e8cd84e0a677?ixlib=rb-0.3.5&s=0792040b39cd0a70ae98f496d3d77ba0&auto=format&fit=crop&w=2100&q=80",
    "https://images.unsplash.com/photo-1530805948738-95aa20739233?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4cb1b17fac0f1277030668b3a35edc08&auto=format&fit=crop&w=1000&q=80",
    //Drink
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1998822d443cf97d75258149476c5aa5&auto=format&fit=crop&w=2098&q=80",
    "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d4f76f0a31afeee4f24b6f145d52e56e&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1502441867382-f681599c78ad?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0f125087a5cd57c1c1bfcb764f71c115&auto=format&fit=crop&w=2100&q=80",
    "https://images.unsplash.com/photo-1470338745628-171cf53de3a8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b021b2cbe86640f8b50c8b24bc03b576&auto=format&fit=crop&w=934&q=80",
    "https://images.unsplash.com/photo-1504502350688-00f5d59bbdeb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b55ee05a2351e8dac946d5f93a22eb8b&auto=format&fit=crop&w=2100&q=80",
    //Coffee
    "https://images.unsplash.com/photo-1473923377535-0002805f57e8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d239ac0e409e18cf74ace503c491714f&auto=format&fit=crop&w=2338&q=80",
    "https://images.unsplash.com/photo-1503481766315-7a586b20f66d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=171a33e240a569a1ec388813e629ebe0&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1458819757519-7581bade511d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=64572ee0b13e28e430326f3257d0b070&auto=format&fit=crop&w=2104&q=80",
    "https://images.unsplash.com/photo-1426260193283-c4daed7c2024?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=510736e9d9454f5184f4eed1d5b005b0&auto=format&fit=crop&w=2110&q=80",
    "https://images.unsplash.com/photo-1500753901411-b19b8981b197?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3ef217e48993fffcedab7b482ab350f7&auto=format&fit=crop&w=2100&q=80",
    //Dessert
    "https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c56c38adec64e43406709056cd406077&auto=format&fit=crop&w=934&q=80",
    "https://images.unsplash.com/photo-1504473089979-b1c4993a9653?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9db69b72e1f7d1b4e5c81cee531108ff&auto=format&fit=crop&w=934&q=80",
    "https://images.unsplash.com/photo-1422255198496-21531f12a6e8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=25f55fdabb6531a58775e4b9bba51aa9&auto=format&fit=crop&w=2106&q=80",
    "https://images.unsplash.com/photo-1451475836122-926a326bda4f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=60ec5c9cda0c962c47d98acbcc3fd66b&auto=format&fit=crop&w=2106&q=80",
    "https://images.unsplash.com/photo-1495747895702-efcc225f9c22?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=aa4d58e66b5b6436fdecb1ae72a92ef7&auto=format&fit=crop&w=932&q=80",
  ]
  imgClass: string[] = ["imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff"]


  discountType: string;

  storage: any;
  uid: string;
  ref: any;

  constructor(public loadingCtrl: LoadingController,private afStorage: AngularFireStorage,public platform: Platform, public viewCtrl: ViewController, public navParams: NavParams, public alertCtrl: AlertController, public dealProv: DealsProvider) {
    this.discountType = "percent";
    this.dealType = "Entree";
    this.newDeal.rID = this.navParams.get("ID");
    this.newDeal.rName = this.navParams.get("name");
    if (this.platform.is('mobile')) {
      this.mobile = true;
    }if (platform.is('core')) {
      this.mobile = false;
    }
  }



  ionViewDidLoad() {
    this.slides.lockSwipes(true);
  }

  dismiss() {
    let alert = this.alertCtrl.create({
      title: 'Notice',
      subTitle: 'Deal not yet created. Leaving now will delete any progress.',
      buttons: [{
        text: 'Leave',
        role: 'destructive',
        handler: () => {
          if (this.ref){
            this.ref.delete();
          }
          this.viewCtrl.dismiss();
        }
      },{
        text: 'Stay'
      }
    ]
    });
    alert.present();
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
        if (this.downloadURL === undefined && this.startedUpload && !this.loaded){
          this.presentAlert('Please wait for image to upload.');
          break;
        }else if (this.downloadURL === undefined){
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
        this.newDeal.StartTime = moment(this.startDate + "T" + this.startTime).unix();
        this.newDeal.EndTime = moment(this.endDate + "T" + this.endTime).unix();
        this.dispStart = moment(this.startDate + "T" + this.startTime).format('LLLL');
        this.dispEnd = moment(this.endDate + "T" + this.endTime).format('LLLL');
      }else{
        this.newDeal.StartTime = moment(this.startDate).unix();
        this.newDeal.EndTime = moment(this.endDate).unix();
        this.dispStart = moment(this.startDate).format('LL');
        this.dispEnd = moment(this.endDate).format('LL')
      }
    //Create deal string
      if(this.discountType == "BOGO"){
        this.newDeal.dealDesc = "Buy One Get One " + this.dealType;
      }else if (this.discountOf && this.discountOf!=""){
        if (this.dealType == "Entire Order"){
          this.newDeal.dealDesc = this.discount + " a " + this.discountOf + " Order";
        }else{
          this.newDeal.dealDesc = this.discount + " a " + this.discountOf + " " + this.dealType;
        }
      }else{
        if (this.dealType == "Entire Order"){
          this.newDeal.dealDesc = this.discount + " " + this.dealType;
        }else{
          this.newDeal.dealDesc = this.discount + " One " + this.dealType;
        }
      }
      this.newDeal.activeDays = this.dealDays;
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
          const key = this.dealProv.createDeal(this.newDeal);
          this.newDeal['key'] = key; 
          this.viewCtrl.dismiss(this.newDeal);
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
        deals.push(i*5 + "% Off");
      }
    }else if (type=="dollarOf"){
      for (let i = 2;i<=100;i++){
        deals.push("$" + i);
      }
    }else{
      for (let i = 2;i<=50;i++){
        deals.push("$" + i + " Off");
      }
    }
    return deals;
  }

  getDay(day){
    return this.dealDays[day];
  }

  upload(event) {
    var fileUpload = event.target;
    if (fileUpload.files.length > 0){
      this.imgClass = ["imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff"];
      var reader = new FileReader();
      //Read the contents of Image File.
      reader.readAsDataURL(fileUpload.files[0]);
      var tempThis = this;//wtf why??!!
      reader.onload = function (e) {
          //Initiate the JavaScript Image object.
          var image = new Image();
          let target: any = e.target; //<-- This (any) will tell compiler to shut up!

          //Set the Base64 string return from FileReader as source.
          image.src = target.result;
          
          //Validate the File Height and Width.
          image.onload = function () {
              var height = image.height;
              var width = image.width;
              if (height < 500 || width < 500) {
                  alert("Please select a higher resolution photo or use one of our preselected options.");
                  return false;
              }else{
                let loading = tempThis.loadingCtrl.create({
                  content: 'Uploading image. This may take a minute, please wait...'
                });
                loading.present();
                tempThis.loaded = false;
                tempThis.startedUpload = true;
                tempThis.ref = tempThis.afStorage.ref('/Restaurants/'+tempThis.newDeal.rID+'/'+randomId);
                const task = tempThis.ref.put(fileUpload.files[0]);
                task.snapshotChanges().pipe(
                  finalize(() => {
                    // tempThis.downloadURL = tempThis.ref.getDownloadURL()
                    tempThis.ref.getDownloadURL().subscribe(url => {
                      tempThis.newDeal.photo = url;
                      tempThis.downloadURL = url;
                      loading.dismiss();          
                    });
                  })
                ).subscribe()
              }
          };
        }
    }
  }

  imgSelect(img,idx){
    this.newDeal.photo = img;
    this.downloadURL = img;
    //TODO: Fix this
    this.imgClass = ["imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff","imgOff"];
    this.imgClass[idx] = "imgOn";
  }

  getClass(idx){
    return this.imgClass[idx];
  }
}
