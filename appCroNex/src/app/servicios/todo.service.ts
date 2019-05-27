import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskI } from '../models/task.interface';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  
  private todosCollection: AngularFirestoreCollection<TaskI>;
  private todos: Observable<TaskI[]>;
  private usuario: '';

  constructor(db: AngularFirestore,
              private storage: Storage) 
  {
    console.log(this.usuario);
    this.todosCollection = db.collection<TaskI>('todos',ref => ref.where('usuario','==',''));
    this.todos = this.todosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  async getKey(key:string): Promise<void>{
    return await this.storage.get(key)
    .then((val) => {
      this.usuario = val;
      console.log(this.usuario)
    });
  }

  getTodos() {
    return this.todos;
  }

  getTodo(id: string) {
    return this.todosCollection.doc<TaskI>(id).valueChanges();
  }

  updateTodo(todo: TaskI, id: string ) {
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: TaskI ){
    return this.todosCollection.add(todo);
  }

  removeTodo(id: string){
    return this.todosCollection.doc(id).delete();
  }


}
