import { Component } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { MenuController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public userdata: {};

  constructor (public authservice : AuthService, 
               private menu: MenuController,
               public AFauth: AngularFireAuth)
  {
    this.AFauth.authState.subscribe(user => {
      this.userdata = user;
    });
  }
  signOut(){
    this.authservice.logout();
  }
  ionViewWillEnter() {
    this.menu.enable(true);
  }

}
