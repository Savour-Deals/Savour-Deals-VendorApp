import { DealModel } from './../../models/deal';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, ViewController, NavParams, Slides,Navbar, AlertController, Platform, LoadingController, ModalController  } from 'ionic-angular';
import * as moment from 'moment';
import { AngularFireStorage } from 'angularfire2/storage';
import { DealsProvider } from '../../providers/deals/deals';
import { finalize } from 'rxjs/operators';
import {AppDataProvider} from '../../providers/app-data/app-data'
import { ImgPopoverPage } from '../img-popover/img-popover';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-createdeal',
  templateUrl: 'createdeal.html',
})
export class CreatedealPage {
  newDeal: DealModel;

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
  
  user: any;

  dealType:string;
  startDate:string;
  startTime:string;
  endDate:string;
  dateMax: string = moment().add(5,'years').format('YYYY-MM-DD');
  endTime:string;
  discount: string;
  discountOf: string;
  img:string;
  isAdmin: boolean = false;

  dispStart:string;
  dispEnd:string;

  dealString: string;
  dealStart: number;
  dealEnd: number;
  dealDays: {
    mon:boolean,
    tues:boolean,
    wed:boolean,
    thur:boolean,
    fri:boolean,
    sat:boolean,
    sun:boolean
  } = { mon:true, tues:true, wed:true, thur:true, fri:true, sat:true, sun:true}

  imgArr: any[];
  selectedImg: number = -1;

  discountType: string;
  storage: any;
  uid: string;
  ref: any;
  editing = false;

  stripeID: string;

  constructor(public loadingCtrl: LoadingController, private afauth: AngularFireAuth,public af: AngularFireDatabase, public modalCtrl: ModalController,private afStorage: AngularFireStorage,public platform: Platform, public viewCtrl: ViewController, public navParams: NavParams, public alertCtrl: AlertController, public dealProv: DealsProvider, public appData: AppDataProvider) {
    const deal = this.navParams.get("deal");
    if (deal){//we are passing a deal in. Must be editing
      this.editing = true;
      this.newDeal = deal;
      this.dealType = "Custom";
      this.discountType = "custom";
      this.discount = this.newDeal.deal_description;
      this.startDate = moment.unix(this.newDeal.start_time).format('YYYY-MM-DD');
      this.endDate = moment.unix(this.newDeal.end_time).format('YYYY-MM-DD');
      this.startTime = moment.unix(this.newDeal.start_time).format('HH:mm');
      this.endTime = moment.unix(this.newDeal.end_time).format('HH:mm');
      this.dealDays = this.newDeal.active_days;
      this.downloadURL = deal.photo;
      if (this.startTime === this.endTime){
        this.allDay = true;
      }else{
        this.allDay = false;
      }
    }else{//this is truely a new deal. set up for a new one
      this.newDeal = new DealModel();
      this.discountType = "percent";
      this.dealType = "Entree";
      this.newDeal.vendor_id = this.navParams.get("ID");
      this.newDeal.vendor_name = this.navParams.get("name");
    }
    this.af.object('Users/'+this.afauth.auth.currentUser.uid).snapshotChanges().subscribe( obj =>{
      this.user = obj.payload.val();
      if(this.user != null){
        if (this.user.role != null){
          if (this.user.role == "admin"){
            this.isAdmin = true;
          }
        }
      }
    });
    if (this.platform.is('mobile')) {
      this.mobile = true;
    }if (platform.is('core')) {
      this.mobile = false;
    }
    this.appData.getItemImages().subscribe(data => {
      this.imgArr = Array.from(data.values())
    });
  }



  ionViewDidLoad() {
    this.slides.lockSwipes(true);
  }

  dismiss() {
    var msg = 'Deal not yet created. Leaving now will delete any progress.';
    if (this.editing){
      msg = 'Changes have not been saved. Leaving now will delete any progress.'
    }
    let alert = this.alertCtrl.create({
      title: 'Notice',
      subTitle: msg,
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
        this.newDeal.start_time = moment(this.startDate + "T" + this.startTime).unix();
        this.newDeal.end_time = moment(this.endDate + "T" + this.endTime).unix();
        this.dispStart = moment(this.startDate + "T" + this.startTime).format('LLLL');
        this.dispEnd = moment(this.endDate + "T" + this.endTime).format('LLLL');
      }else{
        this.newDeal.start_time = moment(this.startDate).unix();
        this.newDeal.end_time = moment(this.endDate).unix();
        this.dispStart = moment(this.startDate).format('LL');
        this.dispEnd = moment(this.endDate).format('LL')
      }
    //Create deal string
      if(this.discountType == "BOGO"){
        this.newDeal.deal_description = "Buy One Get One " + this.dealType;
      }else if (this.discountOf && this.discountOf!=""){
        if (this.dealType == "Entire Order"){
          this.newDeal.deal_description = this.discount + " a " + this.discountOf + " Order";
        }else{
          this.newDeal.deal_description = this.discount + " a " + this.discountOf + " " + this.dealType;
        }
      }else if (this.dealType == "Custom"){
        this.newDeal.deal_description = this.discount;
      }else{
        if (this.dealType == "Entire Order"){
          this.newDeal.deal_description = this.discount + " " + this.dealType;
        }else{
          this.newDeal.deal_description = this.discount + " One " + this.dealType;
        }
      }
      this.newDeal.active_days = this.dealDays;
    }else{
      this.atEnd = false;
      this.atFront = false;
    }
  }

  confirmed(){
    var msg = 'Hit CONFIRM to create your new deal. Once confirmed, you will NOT be able to edit this deal!';
    if (this.editing){
      msg = 'Hit CONFIRM to save changes to your deal.'
    }
    let alert = this.alertCtrl.create({
      title: 'Confirm Deal',
      subTitle: msg,
      buttons: [{
        text: 'No wait!'
      },{
        text: 'CONFIRM',
        role: 'destructive',
        handler: () => {
          if(this.editing){
            this.dealProv.updateDeal(this.newDeal);
          }else{
            const key = this.dealProv.createDeal(this.newDeal);
            this.newDeal['key'] = key; 
            // this.createNotification(this.newDeal);
          }
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
      for (let i = 2;i<=15;i++){
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
          if (height < 300 || width < 300) {
              alert("Please select a higher resolution photo or use one of our preselected options.");
              return false;
          }else{
            let loading = tempThis.loadingCtrl.create({
              content: 'Uploading image. This may take a minute, please wait...'
            });
            loading.present();
            tempThis.loaded = false;
            tempThis.startedUpload = true;
            const randomId = Math.random().toString(36).substring(2)
            tempThis.ref = tempThis.afStorage.ref('/Vendors/'+tempThis.newDeal.vendor_id+'/dealPhotos/'+randomId);
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

  openSelector(){
    let modal = this.modalCtrl.create(ImgPopoverPage, { imgs: this.imgArr }, { cssClass: 'my-modal-inner my-stretch '});
    modal.onDidDismiss(url => {
      if (url){
        this.newDeal.photo = url;
        this.downloadURL = url;
      }
    });
    modal.present();
  }
}



