import { Component, OnInit } from '@angular/core';
import { TaskI } from '../../models/task.interface';
import { TodoService } from '../../servicios/todo.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})
export class TodoDetailsPage implements OnInit {

  todo: TaskI = {
    task: '',
    priority: 0,
    isCheck: false,
  };
  todoId = null;

  constructor(
    private route: ActivatedRoute,
    private nav: NavController,
    private todoservice: TodoService,
    private loadingcontroller: LoadingController
  ) { }

  ngOnInit() {
    this.todoId = this.route.snapshot.params.id;
    if (this.todoId) {
      this.loadTodo();
    }
  }

  async loadTodo() {
    const loading = await this.loadingcontroller.create({
      message: 'Cargando.....'
      });
    await loading.present();
    this.todoservice.getTodo(this.todoId).subscribe( res =>{
      loading.dismiss();
      this.todo = res;
    });
  }

  async saveTodo() {
    const loading = await this.loadingcontroller.create({
      message: 'Guardando.....'
      });
    await loading.present();
    if(this.todoId){
      //Update
      this.todoservice.updateTodo(this.todo, this.todoId).then(() => {
        loading.dismiss();
        this.nav.navigateForward('/task');
      });
    }
    else{
      //addnew
      this.todoservice.addTodo(this.todo).then(() => {
        loading.dismiss();
        this.nav.navigateForward('/task');
      });
    }
  }

  onRemove(idtodo: string){
    this.todoservice.removeTodo(idtodo);
  }
}
