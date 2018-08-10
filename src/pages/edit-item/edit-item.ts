import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { VendorsProvider } from '../../providers/vendors/vendors';

/**
 * Generated class for the EditNamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-item',
  templateUrl: 'edit-item.html',
})
export class EditItemPage {

  public location: any;
  public item: number;
  public titles: string[];
  public values: any[];
  public description: String;
  public loyaltyEnabled: Boolean;

  //TODO: Add Validation in a nicer way!
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private vendProv: VendorsProvider, private alertCtrl: AlertController) {
    this.location = navParams.get('location');
    this.item = navParams.get('item');
    if (this.item == 0){
      this.titles = ['Name', 'Address', 'Menu URL'];
      this.values = [this.location.Name || '',this.location.Address || '',this.location.Menu || ''];
    }else if (this.item == 1){
      this.titles = ["Description"];
      this.values = [this.location.Desc || ''];
    }else if (this.item == 2){
      this.loyaltyEnabled = false;
      this.titles = ["Deal", "Daily points"];
      if (this.location.Loyalty.loyaltyDeal){
        this.loyaltyEnabled = true
        this.values = [this.location.Loyalty.loyaltyDeal,this.location.Loyalty.loyaltyPoints];
      }else{
        this.values = ['',{
          "Fri" : 10,
          "Mon" : 10,
          "Sat" : 10,
          "Sun" : 10,
          "Thurs" : 10,
          "Tues" : 10,
          "Wed" : 10
        }];
      }
    }
  }

  ionViewDidLoad() {
  }

  close() {
    this.viewCtrl.dismiss();
  }



  submit(){
    var data = {};
    const dataIsValid = this.validateValues(this.values, this.item);
    if (this.item == 0 && dataIsValid){
      data = {'Name': this.values[0], 'Address': this.values[1], 'Menu': this.values[2]};
      this.vendProv.editVendorInfo(this.location.key, data);
      this.close();
    }else if (this.item == 1 && dataIsValid){
      data = {"Desc": this.values[0]};
      this.vendProv.editVendorInfo(this.location.key, data);
      this.close();
    }else if (this.item == 2){
      if (this.loyaltyEnabled && dataIsValid){
        //update loyalty information using provider
        data = {
          "loyaltyCount" : 100,
          "loyaltyDeal" : this.values[0].toLowerCase(),
          "loyaltyPoints" : {
            //*1 to convert from string to number when sending to firebase
            //Dont know why form type number goes to Firebase as string
            "Fri" : this.values[1].Fri*1,
            "Mon" : this.values[1].Mon*1,
            "Sat" : this.values[1].Sat*1,
            "Sun" : this.values[1].Sun*1,
            "Thurs" : this.values[1].Thurs*1,
            "Tues" : this.values[1].Tues*1,
            "Wed" : this.values[1].Wed*1
          }
        }
        this.vendProv.editVendorInfo(this.location.key + "/Loyalty", data).then(_ => {
          console.log('success');
          this.close();
        }).catch(err => {
          console.log(err, 'You dont have access!')
        });
      }else if (!this.loyaltyEnabled){
        //We only care to scare the user if they have a loyalty deal running
        if (this.location.Loyalty.loyaltyDeal){
          //Make sure user knows what they are doing
          let alert = this.alertCtrl.create({
            title: 'Are you sure?',
            subTitle: 'Hitting OKAY will delete your current loyalty program and can\'t be undone. Is this what you meant to do?',
            buttons: [{
                text: 'No wait!'
              },{
                text: 'OKAY',
                role: 'destructive',
                handler: () => {
                  //Remove loyalty program... currently if re-enabled, users keep their point totals
                  data = null;
                  this.vendProv.removeVendorInfo(this.location.key, "Loyalty/loyaltyCount");
                  this.vendProv.removeVendorInfo(this.location.key, "Loyalty/loyaltyDeal");
                  this.vendProv.removeVendorInfo(this.location.key, "Loyalty/loyaltyPoints");
                  this.close();
                }
              }
            ]}
          );
          alert.present();
        }else{
          //No loyalty program there to start with. Just close
          this.close();
        }
      }else{
        this.showAlert("Woops!", "Please check no fields are empty and make sure point values are between 1 and 100.");
      }
    }else{
      this.showAlert("Something is Missing!", "Please check that none of the fields are empty and try again.");
    }
  }

  validateValues(values, item){
    if (item < 2){
      //Validate info or description
      var missingValue = false;
      values.forEach(value => {
        if (value == ""){
          missingValue = true;
        }
      });
      if (missingValue){
        return false;
      }
      return true;
    }else if (item == 2){
      //Validate Loyalty
      if (values[0] == ""){
        return false;
      }
      //Check point values between 1 and 100
      var pointsError = false;
      var points = Object.keys(values[1]).map(key => values[1][key]);
      points.forEach(point => {
        if (point > 100 || point < 1){
          pointsError = true;
        }
      });
      if (pointsError){
        return false;
      }
      return true;
    }else{
      //should not have any other values so we will just close
      this.showAlert("Error!", "We have encountered an issue and we are working to figure out what happened.");
      this.close();
    }
  }

  showAlert(ttl, msg){
    let alert = this.alertCtrl.create({
      title: ttl,
      message: msg,
      buttons: ['Okay']
    });
    alert.present();
  }

  getValue(i){
    return this.values[i];
  }

}
