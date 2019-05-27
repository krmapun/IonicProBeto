import { Component, OnInit } from '@angular/core';
import { TaskI } from '../../models/task.interface';
import { TodoService } from '../../servicios/todo.service';
import { AuthService } from '../../servicios/auth.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

  todos: TaskI[];
  constructor( private todoService: TodoService,
               public authservice : AuthService) {}

  ngOnInit() {
      this.todoService.getTodos().subscribe((todos) => {
        this.todos = todos;
        window.localStorage.setItem('todos',JSON.stringify(todos));
      });
      if(isNullOrUndefined(this.todos)){
        this.todos = JSON.parse(window.localStorage.getItem('todos'));
      }
  }

    signOut(){
    this.authservice.logout();
  }
}
