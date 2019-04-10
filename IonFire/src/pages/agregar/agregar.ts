import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseListObservable
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//  Imports UserActivity Interface
import { UserActivity } from '../../models/user-activity/user-activity.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserModel } from '../../models/user-model';
//  Import AddUserActivityPage and EditUserActivityPage
import { AddUserActivityPage } from '../add-user-activity/add-user-activity';
import { EditUserActivityPage } from '../edit-user-activity/edit-user-activity';
//	Import for orderby data from Angular
import "rxjs/add/operator/map";

@IonicPage()
@Component({
  selector: 'page-agregar',
  templateUrl: 'agregar.html',
})

export class AgregarPage {

  userActivityList$: FirebaseListObservable<UserActivity[]>;
  user = {} as UserModel;
  order = "d_fecha";
  ascending = false;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private toast: ToastController,
    private actionSheetCtrl: ActionSheetController,
  	private database: AngularFireDatabase) {
    this.afAuth.authState.subscribe(data => {
      //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
      this.userActivityList$ = this.database.list('user-activity')
        .map(_userActivities => 
          _userActivities.filter(userActivity => userActivity.uid == data.uid)) as FirebaseListObservable<UserActivity[]>;
    });
  }

  myDate: String = getCurDate(new Date(),0,'+').toISOString().slice(0, 10);

  AddUserActivity(){
    //  Navigate the user to the AddUserActivity
    this.navCtrl.push(AddUserActivityPage);
  }

  selectUserActivity(userActivity: UserActivity){
  	// Validate that can edit only if data is in range date permited
  	if((userActivity.d_fecha == getCurDate(new Date(),1,'-').toISOString().slice(0, 10))
  		|| (userActivity.d_fecha == getCurDate(new Date(),1,'-').toISOString().slice(0, 10))
  		|| (userActivity.d_fecha == getCurDate(new Date(),0,'+').toISOString().slice(0, 10))
  		//|| (userActivity.d_fecha == getCurDate(new Date(),1,'+').toISOString().slice(0, 10))
  		){
	    this.actionSheetCtrl.create({
        title: `Editar ${userActivity.d_fecha}`,
        buttons: [
          {
            text: 'Editar',
            handler: () => {
              //  Send the user to the EditShoppingPage and pass the key as parameter
              this.navCtrl.push(EditUserActivityPage, { userActivityId: userActivity.$key });
            }
          },
          /* {
            text: 'Borrar',
            role: 'destrictive',
            handler: () => {
              //  Delete the current UserActivity passed in via of parameter
              this.database.object('/user-activity/' + userActivity.$key).remove();
              this.toast.create({
                message: 'Actividad borrada correctamente',
                duration:3000
              }).present();
            }
          }, */
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log("The user has selected the cancel button");
            }
          }]
      }).present();
  	}
  	else{
  		this.toast.create({
          message: 'No es posible editar el registro seleccionado',
          duration:3000
        }).present();
  	}
  }

}

function getCurDate(fecha,dias,operando){
	if(operando == '+')
		fecha.setDate(fecha.getDate() + dias);
	else
		fecha.setDate(fecha.getDate() - dias);
  	return fecha;
}