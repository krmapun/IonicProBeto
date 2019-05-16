import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';


@Component({
  selector: 'app-acercade',
  templateUrl: './acercade.page.html',
  styleUrls: ['./acercade.page.scss'],
})
export class AcercadePage implements OnInit {

  constructor(public authservice : AuthService) { }

  ngOnInit() {
  }

  signOut(){
    this.authservice.logout();
  }

}
