import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskI2 } from '../models/calcular.interface';

@Injectable({
  providedIn: 'root'
})
export class CalculadorService {

  private calcularCollection: AngularFirestoreCollection<TaskI2>;
  private calcular: Observable<TaskI2[]>;

  constructor(db: AngularFirestore) { 

    const usuid = window.localStorage.getItem('idusu');
    this.calcularCollection = db.collection<TaskI2>('calcular', ref => ref.where('usuario', '==', usuid));
    this.calcular = this.calcularCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );

  }

  getTodos() {
    return this.calcular;
  }

  getTodo(id: string) {
    return this.calcularCollection.doc<TaskI2>(id).valueChanges();
  }

  addTodo(todo: TaskI2 ){
    return this.calcularCollection.add(todo);
  }

  updateTodo(calcular: TaskI2, id: string ) {
    return this.calcularCollection.doc(id).update(calcular);
  }

}
