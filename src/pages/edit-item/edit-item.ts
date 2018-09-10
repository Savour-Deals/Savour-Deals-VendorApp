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
      this.values = [this.location.name || '',this.location.address || '',this.location.menu || ''];
    }else if (this.item == 1){
      this.titles = ["Description"];
      this.values = [this.location.description || ''];
    }else if (this.item == 2){
      this.loyaltyEnabled = false;
      this.titles = ["Deal", "Daily points"];
      if (this.location.loyalty.loyalty_deal){
        this.loyaltyEnabled = true
        this.values = [this.location.loyalty.loyalty_deal,this.location.loyalty.loyalty_points];
      }else{
        this.values = ['',{
          "fri" : 10,
          "mon" : 10,
          "sat" : 10,
          "sun" : 10,
          "thur" : 10,
          "tues" : 10,
          "wed" : 10
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
      data = {'name': this.values[0], 'address': this.values[1], 'menu': this.values[2]};
      this.vendProv.editVendorInfo(this.location.key, data);
      this.close();
    }else if (this.item == 1 && dataIsValid){
      data = {"description": this.values[0]};
      this.vendProv.editVendorInfo(this.location.key, data);
      this.close();
    }else if (this.item == 2){
      if (this.loyaltyEnabled && dataIsValid){
        //update loyalty information using provider
        data = {
          "loyalty_count" : 100,
          "loyalty_deal" : this.values[0].toLowerCase(),
          "loyalty_points" : {
            //*1 to convert from string to number when sending to firebase
            //Dont know why form type number goes to Firebase as string
            "fri" : this.values[1].fri*1,
            "mon" : this.values[1].mon*1,
            "sat" : this.values[1].sat*1,
            "sun" : this.values[1].sun*1,
            "thur" : this.values[1].thur*1,
            "tues" : this.values[1].tues*1,
            "wed" : this.values[1].wed*1
          }
        }
        this.vendProv.editVendorInfo(this.location.key + "/loyalty", data).then(_ => {
          console.log('success');
          this.close();
        }).catch(err => {
          this.showAlert("Woops!", "Looks like something went wrong. Please contact us and we will fix this ASAP.");

        });
      }else if (!this.loyaltyEnabled){
        //We only care to scare the user if they have a loyalty deal running
        if (this.location.loyalty.loyalty_deal){
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
                  this.vendProv.removeVendorInfo(this.location.key, "loyalty/loyalty_count");
                  this.vendProv.removeVendorInfo(this.location.key, "loyalty/loyalty_deal");
                  this.vendProv.removeVendorInfo(this.location.key, "loyalty/loyalty_points");
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
