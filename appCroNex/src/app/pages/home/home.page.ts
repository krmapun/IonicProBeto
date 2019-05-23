import { Component } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor (public authservice : AuthService, private menu: MenuController){}
  signOut(){
    this.authservice.logout();
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

}
