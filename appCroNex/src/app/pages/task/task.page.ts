import { Component, OnInit } from '@angular/core';
import { TaskI } from '../../models/task.interface';
import { TodoService } from '../../servicios/todo.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

  todos: TaskI[];

  constructor( private todoService: TodoService,
               public authservice : AuthService) { }
  ngOnInit() {
    this.todoService.getTodos().subscribe((todos) => {
      console.log('Tareas', todos);
      this.todos = todos;
    });
  }

    signOut(){
    this.authservice.logout();
  }
}
