import { Component } from '@angular/core';
import { NavParams, ModalController, ViewController } from 'ionic-angular';
import { VendorModel } from '../../models/restaurant';
import { Observable } from 'rxjs';
import { EditItemPage } from '../edit-item/edit-item';

@Component({
  selector: 'page-edit-vendor',
  templateUrl: 'edit-vendor.html',
})
export class EditVendorPage {
  public obs: Observable<any[]> 
  public vendor: VendorModel = { 
    key: '',
    Name: '',
    Photo: '',
    Address: '',
    Description: '',
    Phone: '',
    Loyalty: {
        code: '',
        count: 0,
        deal: '',
        points: {
            Mon: 0,
            Tues: 0,
            Wed: 0,
            Thurs: 0,
            Fri: 0,
            Sat: 0,
            Sun : 0
        }
    }
  };
  
  constructor(public viewCtrl: ViewController, public modalCtrl: ModalController, public navParams: NavParams) {
    this.obs = navParams.get('loc');
    this.obs.subscribe(loc =>{
      const location = (loc as any);
      this.vendor.key = location.key;
      this.vendor.Name = location.Name;
      this.vendor.Photo = location.Photo;
      this.vendor.Address = location.Address;
      this.vendor.Description = location.Description;
      this.vendor.Loyalty = location.Loyalty;
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditVendorPage');
  }

  editInfo(loc: any, item: number){
    let popover = this.modalCtrl.create(EditItemPage, {
      item: item,
      location: loc
    }, { cssClass: 'my-modal-inner my-stretch'});
    popover.present({
    });
  }
  upload(event) {
    // var fileUpload = event.target;
    // if (fileUpload.files.length > 0){
    //   var reader = new FileReader();
    //   //Read the contents of Image File.
    //   reader.readAsDataURL(fileUpload.files[0]);
    //   var tempThis = this;//wtf why??!!
    //   reader.onload = function (e) {
    //     //Initiate the JavaScript Image object.
    //     var image = new Image();
    //     let target: any = e.target; //<-- This (any) will tell compiler to shut up!

    //     //Set the Base64 string return from FileReader as source.
    //     image.src = target.result;
        
    //     //Validate the File Height and Width.
    //     image.onload = function () {
    //       var height = image.height;
    //       var width = image.width;
    //       if (height < 500 || width < 500) {
    //           alert("Please select a higher resolution photo or use one of our preselected options.");
    //           return false;
    //       }else{
    //         let loading = tempThis.loadingCtrl.create({
    //           content: 'Uploading image. This may take a minute, please wait...'
    //         });
    //         loading.present();
    //         tempThis.loaded = false;
    //         tempThis.startedUpload = true;
    //         tempThis.ref = tempThis.afStorage.ref('/Vendors/'+tempThis.newDeal.rID+'/'+randomId);
    //         const task = tempThis.ref.put(fileUpload.files[0]);
    //         task.snapshotChanges().pipe(
    //           finalize(() => {
    //             // tempThis.downloadURL = tempThis.ref.getDownloadURL()
    //             tempThis.ref.getDownloadURL().subscribe(url => {
    //               tempThis.newDeal.photo = url;
    //               tempThis.downloadURL = url;
    //               loading.dismiss();          
    //             });
    //           })
    //         ).subscribe()
    //       }
    //     };
    //   }
    // }
  }

}

