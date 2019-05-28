import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-calculador',
  templateUrl: './calculador.page.html',
  styleUrls: ['./calculador.page.scss'],
})
export class CalculadorPage implements OnInit {

  constructor(public authservice : AuthService) { }

  ngOnInit() {
  }

  signOut(){
    this.authservice.logout();
  }
}
