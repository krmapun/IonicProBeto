import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {

  items: Observable<any[]>;
  tasks: Observable<any[]>;
 

  constructor(public authservice: AuthService,
              public db: AngularFirestore)
  {

  const usuid = window.localStorage.getItem('idusu');
  this.items = db.collection('todos', ref => ref.where('usuario', '==', usuid)).valueChanges();
  this.tasks = db.collection('calcular',ref => ref.where('usuario', '==', usuid).limit(1)).valueChanges();
  }

  ngOnInit() {
  }

  signOut() {
    this.authservice.logout();
  }

}
