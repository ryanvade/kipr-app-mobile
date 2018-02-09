import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TeamProvider } from '../../providers/team/team';
import { SettingsProvider } from '../../providers/settings/settings';


@IonicPage()
@Component({
  selector: 'page-signIn',
  templateUrl: 'signIn.html'
})

export class SignInPage {

teams: string[];
teamName: string;
competitionID: number;
private displayNoResults: Boolean;
private loading: Boolean = true;

//get list of teams in competition 
constructor(public navCtrl: NavController, public navParams:NavParams, private alertCtrl: AlertController, 
  private TeamPrvdr: TeamProvider, private settingsPrvdr: SettingsProvider){
    this.getTeamsSignedin();
}

async getTeamsSignedin()
{
  this.competitionID = await this.settingsPrvdr.getSignInCompetitionID();
  this.TeamPrvdr.getRegisteredTeamsInComp(this.competitionID).then(val => {
    console.log(val);
    this.teams = val;
    if (this.teams.length <= 0) {
      this.displayNoResults = true;
    }
    this.loading = false;
  }).catch(err => {console.error(err);});
}
//sign team in to be added to competition bracket
teamSignedIn(team){
  this.TeamPrvdr.getTeamSignIn(team.id, this.competitionID).then(() => {
    let alert = this.alertCtrl.create({
      title: 'Confirmation',
      subTitle: 'You are signed in!',
      buttons: [
        {
          text: 'Ok',
          handler: (getTeamSignIn) => {
          this.teams.splice(this.teams.indexOf(team), 1);  
          console.log('Sign in confirmed');
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            this.cancelSignIn(team);
            console.log('Canceled')
          }
        }
      ]
    }); alert.present();
  }).catch((error)=> {console.error(error);});
}

async cancelSignIn(team) {
  await this.TeamPrvdr.unRegisterATeam(team.id, this.competitionID);
}


ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }
}
