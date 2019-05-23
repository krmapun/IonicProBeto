import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {

  public email: string;

  constructor(public authservice: AuthService, private menu: MenuController) { }

  ngOnInit() {
  }

  onSubmitReset() {
    this.authservice.resetpass(this.email);
    alert('Se ha enviado restauracion al correo ingresado');
  }
  
  ionViewWillEnter() {
    this.menu.enable(false);
  }
}
