import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public email: string;
  public password: string;

  constructor(public authservice: AuthService, private menu: MenuController) {}

  ngOnInit() {
  }

  onSubmitRegister() {
    this.authservice.register(this.email, this.password).then(auth => {
      alert('Usuario registrado exitosamente');
      console.log(auth);
    }).catch(err => console.log(err));
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }
}
