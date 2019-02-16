import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';

import { Facebook } from '@ionic-native/facebook';

import { TwitterConnect } from '@ionic-native/twitter-connect';

import { AuthService } from '../../providers/auth-service';

import { UserModel } from '../../models/user-model';

import { SignInPage } from '../signin/signin';

import { HomePage } from '../home/home';


@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignUpPage {
    userModel: UserModel;

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public authService: AuthService,
        public platform: Platform,
        public facebook: Facebook,
        public twitterConnect: TwitterConnect) {
        this.userModel = new UserModel();
    }

    signUp() {
        let loading = this.loadingCtrl.create({
            content: 'Creando cuenta. Por favor, espere...'
        });
        loading.present();

        this.authService.createUserWithEmailAndPassword(this.userModel).then(result => {
            loading.dismiss();

            this.navCtrl.setRoot(SignInPage);
        }).catch(error => {
            loading.dismiss();

            console.log(error);
            this.alert('Error', 'Ha ocurrido un error inesperado. Por favor intente nuevamente.');
        });
    }

    alert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

    signInWithFacebook() {
      return this.authService.signInWithPopup().then(result => {
        this.navCtrl.setRoot(HomePage);
      }).catch(error =>
        console.log('error', error))
      ;
      /* if (this.platform.is('cordova')) {
        return this.facebook.login(['email']).then(result => {
          // this.authService.signInWithFacebook(result.authResponse.accessToken).then(result => {
          this.navCtrl.setRoot(HomePage);
          //  });
          //this.alert('Error', 'Esta plataforma es cordova.');
        });
      } else {
        return this.authService.signInWithPopup().then(result => {
          this.navCtrl.setRoot(HomePage);
          //this.alert('Error', 'esta plataforma es web voy a emergente.');
        });
      } */
    }

    signInWithTwitter() {
      if (this.platform.is('cordova')) {
        this.twitterConnect.login().then(this.onSuccess, this.onError);
      } else{
        return this.authService.signInWithPopupTwitter().then(result => {
          this.navCtrl.setRoot(HomePage);
          //this.alert('Error', 'esta plataforma es web voy a emergente.');
        });
      }
    }

    onSuccess = (response) => {
      const twitterCredential = firebase.auth.TwitterAuthProvider.credential(response.token, response.secret);
      this.authService.angularFireAuth.auth.signInWithCredential(twitterCredential).then(res => {
        this.userModel = res;
        this.navCtrl.setRoot(HomePage);
        console.log(res);
      }).catch(error =>
        console.log('error', error)
      )

    };

    onError(error) {
      console.log('error', error);
    }


}
