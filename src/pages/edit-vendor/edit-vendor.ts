import { Component } from '@angular/core';
import { NavParams, ModalController, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { VendorModel } from '../../models/vendor';
import { Observable } from 'rxjs';
import { EditItemPage } from '../edit-item/edit-item';
import { VendorsProvider } from '../../providers/vendors/vendors';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'page-edit-vendor',
  templateUrl: 'edit-vendor.html',
})
export class EditVendorPage {
  public obs: Observable<any[]> 
  public vendor: VendorModel = { 
    key: '',
    name: '',
    photo: '',
    address: '',
    description: '',
    phone: '',
    loyalty: {
        code: '',
        count: 0,
        deal: '',
        points: {
            mon: 0,
            tues: 0,
            wed: 0,
            thurs: 0,
            fri: 0,
            sat: 0,
            sun : 0
        }
    },
    daily_hours: {
      mon: '',
      tues: '',
      wed: '',
      thurs: '',
      fri: '',
      sat: '',
      sun : '',
    }
  };
  ref: any;
  
  constructor(private alertCtrl: AlertController ,public viewCtrl: ViewController, public modalCtrl: ModalController, public navParams: NavParams, public vendProv: VendorsProvider,private afStorage: AngularFireStorage, private loadingCtrl: LoadingController) {
    this.obs = navParams.get('loc');
    this.obs.subscribe(loc =>{
      this.vendor.key = loc[0].key;
      this.vendor.name = loc[0].Name;
      this.vendor.photo = loc[0].Photo;
      this.vendor.address = loc[0].Address;
      this.vendor.description = loc[0].Description;
      this.vendor.loyalty = loc[0].loyalty;
      this.vendor.daily_hours = loc[0].daily_hours;
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
  }

  editInfo(loc: any, item: number){
    if (item < 4){
      let popover = this.modalCtrl.create(EditItemPage, {
        item: item,
        location: loc
      }, { cssClass: 'my-modal-inner my-stretch'});
      popover.present();
    }else{
      let alert = this.alertCtrl.create({
        title: 'Page not found!',
        subTitle: 'The page to edit this item was not found. Please try again later.',
        buttons: ['Dismiss']
      });
      alert.present();
    }
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
          if (height < 10 || width < 10) {
              alert("Please select a higher resolution photo.");
              return false;
          }else{
            let loading = tempThis.loadingCtrl.create({
              content: 'Uploading image. This may take a minute, please wait...'
            });
            loading.present();
            // tempThis.loaded = false;
            // tempThis.startedUpload = true;
            tempThis.ref = tempThis.afStorage.ref('/Vendors/'+ tempThis.vendor.key + '/' + tempThis.vendor.key);
            const task = tempThis.ref.put(fileUpload.files[0]);
            task.snapshotChanges().pipe(
              finalize(() => {
                // tempThis.downloadURL = tempThis.ref.getDownloadURL()
                tempThis.ref.getDownloadURL().subscribe(url => {
                  tempThis.vendor.photo = url;
                  tempThis.vendProv.editVendorInfo(tempThis.vendor.key, {"photo":url});
                  loading.dismiss();          
                });
              })
            ).subscribe()
          }
        };
      }
    }
  }

}

