import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { VendorsProvider } from '../../providers/vendors/vendors';
import * as moment from 'moment';

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
  public secondary = [false,false,false,false,false,false,false];

  //TODO: Add Validation in a nicer way!
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private vendProv: VendorsProvider, private alertCtrl: AlertController) {
    this.location = navParams.get('location');
    this.item = navParams.get('item');
    switch (this.item) {
      case 0: {
        this.titles = ['Name', 'Address', 'Menu URL'];
        this.values = [this.location.name || '',this.location.address || '',this.location.menu || ''];
        break;
      }case 1: {
        this.titles = ["Description"];
        this.values = [this.location.description || ''];
        break;
      }case 2: {
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
            "thurs" : 10,
            "tues" : 10,
            "wed" : 10
          }];
        }
        break;
      }case 3: {
        this.titles = ["Hours of Operation"];
        if (this.location.daily_hours){
          this.values = [
            ["Monday",this.parseHours(this.location.daily_hours.mon,0),this.isClosed(this.location.daily_hours.mon)],
            ["Tuesday",this.parseHours(this.location.daily_hours.tues,1),this.isClosed(this.location.daily_hours.tues)],
            ["Wednesday",this.parseHours(this.location.daily_hours.wed,2),this.isClosed(this.location.daily_hours.wed)],
            ["Thursday",this.parseHours(this.location.daily_hours.thurs,3),this.isClosed(this.location.daily_hours.thurs)],
            ["Friday",this.parseHours(this.location.daily_hours.fri,4),this.isClosed(this.location.daily_hours.fri)],
            ["Saturday",this.parseHours(this.location.daily_hours.sat,5),this.isClosed(this.location.daily_hours.sat)],
            ["Sunday",this.parseHours(this.location.daily_hours.sun,6),this.isClosed(this.location.daily_hours.sun)]
          ];
        }else{
          this.values = [
            ["Monday",[["07:00", "17:00"],[[],[]]],false],
            ["Tuesday",[["07:00", "17:00"],[[],[]]],false],
            ["Wednesday",[["07:00", "17:00"],[[],[]]],false],
            ["Thursday",[["07:00", "17:00"],[[],[]]],false],
            ["Friday",[["07:00", "17:00"],[[],[]]],false],
            ["Saturday",[["07:00", "17:00"],[[],[]]],false],
            ["Sunday",[["07:00", "17:00"],[[],[]]],false]
          ]
        }
        
        break;
      }default: {
        this.close();
        break;
      }
    }
  }

  ionViewDidLoad() {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  parseHours(str: string,i: number){
    var strArr = str.split(', ');
    var output = [];
    if(strArr[0]){
      if(strArr[0]==="Closed"){
        output.push(["07:00","17:00"]);
      }else{
        output.push([moment(strArr[0].split(' - ')[0], 'h:mm A').format('HH:mm'),moment(strArr[0].split(' - ')[1], 'h:mm A').format('HH:mm')]);
      }
    }else{
      output.push(["07:00","17:00"]);
    }
    if(strArr[1]){
      this.secondary[i]=true;
      output.push([moment(strArr[1].split(' - ')[0], 'h:mm A').format('HH:mm'),moment(strArr[1].split(' - ')[1], 'h:mm A').format('HH:mm')]);
    }else{
      this.secondary[i]=false;
      output.push(["13:00","19:00"]);
    }
    return output;
  }

  isClosed(str: string){
    if (str==="Closed"){
      return true
    }
    return false
  }



  submit(){
    var data = {};
    switch (this.item) {
      case 0: {
        if(this.validateValues(this.values, this.item)){
          data = {'name': this.values[0], 'address': this.values[1], 'menu': this.values[2]};
          this.vendProv.editVendorInfo(this.location.key, data);
          this.close();
        }else{
          this.showAlert("Something is Missing!", "Please check that none of the fields are empty and try again.");
        }
        break;
      }case 1: {
        if(this.validateValues(this.values, this.item)){
          data = {"description": this.values[0]};
          this.vendProv.editVendorInfo(this.location.key, data);
          this.close();
        }else{
          this.showAlert("Something is Missing!", "Please check that none of the fields are empty and try again.");
        }
        break;
      }case 2: {
        if (this.loyaltyEnabled && this.validateValues(this.values, this.item)){
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
              "thurs" : this.values[1].thurs*1,
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
        break;
      }case 3: {
        data = {
          mon: this.valueToHours(this.values[0],0),
          tues: this.valueToHours(this.values[1],1),
          wed: this.valueToHours(this.values[2],2),
          thurs: this.valueToHours(this.values[3],3),
          fri: this.valueToHours(this.values[4],4),
          sat: this.valueToHours(this.values[5],5),
          sun: this.valueToHours(this.values[6],6)
        }
        this.vendProv.editVendorInfo(this.location.key + "/daily_hours", data).then(_ => {
          console.log('success');
          this.close();
        }).catch(err => {
          this.showAlert("Woops!", "Looks like something went wrong. Please contact us and we will fix this ASAP.");
        });
        break;
      }default: {
        this.showAlert("Error!", "We have encountered an issue and we are working to figure out what happened.");
        this.close();
        break;
      }
    }
  }

  valueToHours(value: any, i: number){
    if (value[2]){
      return "Closed";
    }
    var timeString = "";
    timeString = moment(value[1][0][0], 'HH:mm').format('h:mm A') + " - " + moment(value[1][0][1], 'HH:mm').format('h:mm A');
    if(this.secondary[i]){
      timeString += ", " + moment(value[1][1][0], 'HH:mm').format('h:mm A') + " - " + moment(value[1][1][1], 'HH:mm').format('h:mm A');
    }
    return timeString;
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
