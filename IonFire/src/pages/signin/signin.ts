import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';

import { Facebook } from '@ionic-native/facebook';

import { TwitterConnect } from '@ionic-native/twitter-connect';

import { AuthService } from '../../providers/auth-service';

import { UserModel } from '../../models/user-model';

import { SignUpPage } from '../signup/signup';

import { HomePage } from '../home/home';

import { ResetPasswordPage } from "../reset-password/reset-password";

import firebase from "firebase";


@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SignInPage {
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

  signIn() {
    let loading = this.loadingCtrl.create({
      content: 'Iniciando sesión. Por favor, espere...'
    });
    loading.present();

    this.authService.signInWithEmailAndPassword(this.userModel).then(result => {
      loading.dismiss();

      this.navCtrl.setRoot(HomePage);
    }).catch(error => {
      loading.dismiss();

      console.log(error);
      this.alert('Error', 'Ha ocurrido un error inesperado. Por favor intente nuevamente.');
    });
  }

  signUp() {
    this.navCtrl.push(SignUpPage);
  }

  alert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  reiniciarclave() {
    this.navCtrl.push(ResetPasswordPage);
    //console.log();
  }

  signInWithFacebook() {
    if (this.platform.is('cordova')) {  
      return this.facebook.login(['email','public_profile']).then(result => {
          this.authService.signInWithFacebook(result.authResponse.accessToken).then(result => {
          this.navCtrl.setRoot(HomePage);
          });
      }).catch(error =>{
        console.log(error);
        this.alert('Error','Ha ocurrido un error inesperado. Por favor intente nuevamente. #1' + error);
      });
    } else {
      return this.authService.signInWithPopup().then(result => {        
        this.navCtrl.setRoot(HomePage);
        // this.alert('Error', 'esta plataforma es web voy a emergente.');
      }).catch(error =>{
        /* var errorCode = error.id; */
        console.log(error);
        this.alert('Error', 'Ha ocurrido un error inesperado. Por favor intente nuevamente. #2' + error );
      })     
    }
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




  /* signInWithPopupGoogle() {
    return this.authService.signInWithPopup().then(resul => {
      this.navCtrl.setRoot(HomePage);
    });
  } */

  /* signInWithFacebook(){
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(()=>{
      firebase.auth().getRedirectResult().then((result)=>{
        this.navCtrl.setRoot(HomePage);
        //console.log(result)
      }).catch(function(error){
        //alert(JSON.stringify(error))
        console.log(error);
      });
    })

  } */

}
