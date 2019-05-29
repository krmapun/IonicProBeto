import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { TaskI } from '../../models/task.interface';
import { map } from 'rxjs/operators';
import { OrderBy } from '../../../../../IonFire/src/app/orderby.pipe';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {

  items: Observable<any[]>;
  tasks: Observable<any[]>;
  binding: number;

  constructor(public authservice: AuthService,
              public db: AngularFirestore)
  {

  const usuid = window.localStorage.getItem('idusu');
  this.items = db.collection('todos', ref => ref.where('usuario', '==', usuid)).valueChanges();
  this.tasks = db.collection('calcular',ref => ref.where('usuario', '==', usuid).limit(1)).valueChanges();
  }

  ngOnInit() {
    const usuid = window.localStorage.getItem('idusu');
    var refer = this.db.collection('todos', ref => ref.where('usuario', '==', usuid)).get().subscribe(res => console.log(res) ) ;
    console.log(refer);
  }

  signOut() {
    this.authservice.logout();
  }

}
