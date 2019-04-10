import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseListObservable
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//  Imports UserActivity Interface
import { UserProfile } from '../../models/user-profile/user-profile.interface';
import { UserActivity } from '../../models/user-activity/user-activity.interface';

import { AuthService } from '../../providers/auth-service';

import { SignInPage } from '../signin/signin';
import { ProfilePage } from '../profile/profile';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserModel } from '../../models/user-model';
//  Import for orderby data FROM Angular
import "rxjs/add/operator/map";
//  Import AlaSQL
import 'rxjs/add/operator/take';
import * as alasql from 'alasql';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userActivityHomeList$: FirebaseListObservable<UserActivity[]>;
  userProfileHomeList$: FirebaseListObservable<UserProfile[]>;
  user = {
    name: "",
    email: "",
    uid: "0",
    gender: "M",
    photoURL: "assets/images/male.png"
  } as UserModel;
  userActivities = {
    uid: "0",
    totaldays: 0,
    totalweeks: 0,
    totalmonths: 0,
    totalyears: 0
  };

  constructor(public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    private toast: ToastController,
    public authService: AuthService,
    private database: AngularFireDatabase) {

    let uaData = [];

    this.afAuth.authState.subscribe(data => {
      if (data && data.uid) {
        this.userProfileHomeList$ = this.database.list('user-profile')
          .map(_userProfiles =>
            _userProfiles.filter(userProfile => userProfile.uid == data.uid)) as FirebaseListObservable<UserProfile[]>;

        this.userProfileHomeList$.subscribe(
          userProfiles => {
            if(userProfiles.length > 0){
              userProfiles.map(profile => {
                this.user.email = profile.email;
                this.user.name = profile.name;
                this.user.photoURL = profile.photoURL;
                this.user.uid = profile.uid;
                this.user.gender = profile.gender;
              })
            }
            else{
              this.user.email = data.email;
              this.user.name = data.displayName != null ? data.displayName : '';
              this.user.photoURL = (data.photoURL!=null ? data.photoURL : "assets/images/male.png");
              this.user.uid = data.uid;
              this.user.gender = "M";
            }
          })

        
        //  Delete all data by user
        this.database.list('/user-activity',{
          preserveSnapshot: true,
          query: {
            orderByChild: 'uid',
            equalTo: "0",
          }
        }).take(1).subscribe(snaphots=> {
          snaphots.forEach((snapshot) => {
            this.database.object('/user-activity/' + snapshot.key).remove();
          }) 
        })

        //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
        this.userActivityHomeList$ = this.database.list('user-activity')
          .map(_userActivities =>
            _userActivities.filter(userActivity => userActivity.uid == data.uid)) as FirebaseListObservable<UserActivity[]>;

        this.userActivityHomeList$.subscribe(
          userActivities => {
            if (userActivities.length > 0) {
              userActivities.map(userActivity => {
                uaData.push({
                  "uid": userActivity.uid,
                  "fecha": userActivity.d_fecha
                });
              })
              //  Sort data by fecha
              uaData.sort(function compare(a, b) {
                let dateA = +new Date(a.fecha);
                let dateB = +new Date(b.fecha);
                return dateA - dateB;
              });

              //let userDays = alasql('SELECT uid, count(fecha) AS totaldays FROM ? GROUP BY uid', [uaData]);
              // CAMBIO LA CONSULTA PARA TOMAR DIFERENCIA DE DIAS DESDE LA FECHA DE LA PRIMERA ACTIVIDAD
              let userDays = alasql('SELECT uid, ROUND(DATEDIFF(day,DATE(fecha),DATE(Date()))) AS totaldays FROM ? GROUP BY fecha', [uaData]);
              /*let userWMYs = alasql('SELECT uid,fecha, ROUND(DATEDIFF(Week,DATE(fecha), \
              DATE(Date()))) AS totalweeks \
              , ROUND(DATEDIFF(Month,DATE(fecha), DATE(Date()))) AS totalmonths \
              , ROUND(DATEDIFF(Year,DATE(fecha), DATE(Date()))) AS totalyears \
              FROM ? ORDER BY fecha ASC LIMIT 1', [uaData]);*/
              let userWMYs = alasql('SELECT uid,fecha, cast((DATEDIFF(day,DATE(fecha),DATE(Date()))/7) as int)+1 AS totalweeks\
              , cast((DATEDIFF(day,DATE(fecha),DATE(Date()))/28) as int)+1 AS totalmonths \
              , cast((DATEDIFF(day,DATE(fecha),DATE(Date()))/364) as int)+1 AS totalyears \
              FROM ? ORDER BY fecha ASC LIMIT 1', [uaData]);
              this.userActivities = {
                uid: userDays[0].uid,
                totaldays: userDays[0].totaldays,
                totalweeks: userWMYs[0].totalweeks,
                totalmonths: userWMYs[0].totalmonths,
                totalyears: userWMYs[0].totalyears
              }
            }
          }
        );
        
      } 
    });
  }

  signOut() {
    this.authService.signOut();
    this.navCtrl.setRoot(SignInPage);
  }

  profile(){
    this.navCtrl.push(ProfilePage, { uid: this.user.uid });
  }

  ionViewWillLoad(){
    let msg = (this.user.gender == "M" ? "Bienvenido " : "Bienvenida ")+this.user.name;
    //  Send messages to welcome          
    this.toast.create({
      message: msg,
      duration: 3000
    }).present();
      }
}