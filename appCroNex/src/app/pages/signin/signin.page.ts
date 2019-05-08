import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  email: string;
  password: string;
  
  constructor( private authService : AuthService, public router: Router) { }

  ngOnInit() {
  }

  onSubmitLogin(){
    this.authService.login(this.email, this.password).then( res => {
      alert('Bienvenido...');
      this.router.navigate(['/home']);
    }).catch(err => alert('los datos son incorrectos o no existe el usuario'))
  }

}
