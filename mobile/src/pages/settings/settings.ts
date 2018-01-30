import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { StatusProvider } from '../../providers/status/status';
import { IonicPage } from 'ionic-angular';//, NavController, NavParams
import { SettingsProvider } from '../../providers/settings/settings';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';//, BarcodeScannerOptions
/**
 * Generated class for the JudgingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  serverName: String = '';
  authToken: String = '';

constructor(private settingsProvider: SettingsProvider, private status: StatusProvider, private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController){
    this.getSettings();
  }

  async getSettings() {
    this.serverName = await this.settingsProvider.getServerName();
    this.authToken = await this.settingsProvider.getAuthToken();
  }

async scanForAuthToken(){
  this.barcodeScanner.scan().then(async (barcodeData) => {
    console.log(barcodeData.text);
    let valid = await this.status.validateAuthToken(barcodeData.text, this.serverName);
    if(valid) {
      this.authToken = barcodeData.text;
      this.settingsProvider.setAuthToken(barcodeData.text);


    }else {
      this.authToken = '';
      this.settingsProvider.setAuthToken('');
      let alert = this.alertCtrl.create({
        title: 'Authorization Error',
        subTitle: 'Unable to authenticate with the server. Please try again.',
        buttons: ['OK']
      });
      alert.present();
    }
  }, (err) => {
    let alert = this.alertCtrl.create({
      title: 'Authorization Error',
      subTitle: 'Unable to read the QR code. Please try again.',
      buttons: ['OK']
    });
    alert.present();
    console.log(err);
  });
}

  ionViewDidLoad() {
    console.log('Loaded');
  }
}
