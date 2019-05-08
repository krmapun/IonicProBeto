import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public email: string;
  public password: string;

  constructor(public authservice: AuthService) {}

  ngOnInit() {
  }

  onSubmitRegister() {
    this.authservice.register(this.email, this.password).then(auth => {
      alert('Usuario registrado exitosamente');
      console.log(auth);
    }).catch(err => console.log(err));
  }

}
