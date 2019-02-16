import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { UserModel } from '../../models/user-model';

import { SignInPage } from '../signin/signin';



@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  userModel: UserModel;

  constructor( public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authService: AuthService) {
    this.userModel = new UserModel();
  }

  ResetPassword(){
    this.authService.resetPassword(this.userModel).then(result =>{
      this.alert('Excelente', 'Acabamos de enviarte un enlace de restablecimiento a tu correo electrónico.');
      this.navCtrl.setRoot(SignInPage);
    }).catch(error => {

      console.log(error);
      this.alert('Error', 'Ha ocurrido un error inesperado. Por favor intenta nuevamente.');
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

}
