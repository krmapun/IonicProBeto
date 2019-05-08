import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private AFauth : AngularFireAuth,
               private router : Router) { }

  login(email:string, password:string){

    return new Promise((resolve, rejected) => {
      this.AFauth.auth.signInWithEmailAndPassword(email, password).then(user => {
        resolve(user)
      }) .catch(err => rejected(err));
    });
  }

  logout(){
    this.AFauth.auth.signOut().then( auth => {
      this.router.navigate(['/signin']);
    });
  }

  register(email:string, password:string){
    return new Promise((resolve,reject) => {
      this.AFauth.auth.createUserWithEmailAndPassword(email,password).then( res => {
        resolve(res)
      }).catch(err => reject(err));
    });
  }
  
  resetpass(email:string){
    this.AFauth.auth.sendPasswordResetEmail(email).then(console.log).catch(err => console.log(err));
  }
}
