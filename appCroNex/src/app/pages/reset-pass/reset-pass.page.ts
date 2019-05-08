import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {

  public email: string;

  constructor(public authservice: AuthService) { }

  ngOnInit() {
  }

  onSubmitReset() {
    this.authservice.resetpass(this.email);
    alert('Se ha enviado restauracion al correo ingresado');
  }
}
