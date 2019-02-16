import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseObjectObservable
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
//	Imports UserActivity Interface
import { UserActivity } from '../../models/user-activity/user-activity.interface';
import { UserModel } from '../../models/user-model';
import * as alasql from 'alasql';

@Component({
  selector: 'page-edit-user-activity',
  templateUrl: 'edit-user-activity.html',
})
export class EditUserActivityPage {

  sumarMinutos(userActivity: UserActivity){
    let totalMin = 0;
    totalMin = Number(userActivity.d_suenho_descanso.slice(14,16));
    totalMin = totalMin + Number(userActivity.d_alimento.slice(14,16));
    totalMin = totalMin + Number(userActivity.d_yo_cuerpo.slice(14,16));
    totalMin = totalMin + Number(userActivity.d_yo_mente.slice(14,16));
    totalMin = totalMin + Number(userActivity.d_otros.slice(14,16));
    totalMin = totalMin + Number(userActivity.d_trabajo.slice(14,16));
    totalMin = totalMin + Number(userActivity.d_humanidad.slice(14,16));
    totalMin = totalMin + Number(userActivity.d_pareja.slice(14,16));

    totalMin = totalMin / 60;
    return totalMin;
  }

  sumarHoras(userActivity: UserActivity){ 
    let totalMin = this.sumarMinutos(userActivity);
    let totalHoras = 0;
    totalHoras = Number(userActivity.d_suenho_descanso.slice(11,13));
    totalHoras = totalHoras + Number(userActivity.d_alimento.slice(11,13));
    totalHoras = totalHoras + Number(userActivity.d_yo_cuerpo.slice(11,13));
    totalHoras = totalHoras + Number(userActivity.d_yo_mente.slice(11,13));
    totalHoras = totalHoras + Number(userActivity.d_otros.slice(11,13));
    totalHoras = totalHoras + Number(userActivity.d_trabajo.slice(11,13));
    totalHoras = totalHoras + Number(userActivity.d_humanidad.slice(11,13));
    totalHoras = totalHoras + Number(userActivity.d_pareja.slice(11,13));

    return Math.round((totalHoras + totalMin) * 100) / 100;
  }

  tooltips(e,type) {

    let title ="";
    let subtitle ="";

    switch(type){
      case 's': 
        title ="Sueño";
        subtitle ="Actividades relacionadas con dormir: Soñar, conciliar el sueño, tomar una siesta, etc.";
        break;
      case 'a': 
        title ="Alimento";
        subtitle ="Actividades relacionadas con la comida: Cocina, siembra, mercado, medicina, etc.";
        break;
      case 'c': 
        title ="Yo Cuerpo";
        subtitle ="Actividades relacionadas con el bienestar corporal: Ejercicio, salud, higiene, etc.";
        break;
      case 'm': 
        title ="Yo Mente";
        subtitle ="Actividades para ejercitar el cerebro y la memoria: Leer, aprender un idioma, música, ocio, etc.";
        break;
      case 'o': 
        title ="Otros";
        subtitle ="Actividades dedicadas a las relaciones humanas: Hablar con otros, familia, amigos, conocer nuevas personas, etc.";
        break;
      case 't': 
        title ="Trabajo";
        subtitle ="Actividades que impliquen un esfuerzo productivo: Tareas domésticas, empleo, estudio, etc.";
        break;
      case 'h': 
        title ="Humanidad";
        subtitle ="Actos que te recuerden que eres un ser humano: Observar la naturaleza, ayudar al otro, orar o meditar, caminar, viajar, etc.";
        break;
      case 'p': 
        title ="Pareja";
        subtitle ="Actividades que realizas con quien compartes todo en tu vida. Asimismo, escuchar, intimar, resolver problemas, etc.";
        break;
    }

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }
  
  //	Create a new UserActivity Object
  userActivity = {} as UserActivity;
  user = {} as UserModel;
  //	Create a new FirebaseObjectObservable Object
  userActivityEditRef$: FirebaseObjectObservable<UserActivity>
  userActivityEditList$: FirebaseListObservable<UserActivity[]>

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,  
    private toast: ToastController,  
  	private database: AngularFireDatabase) {

    let uaData = [];

  	const userActivityId = this.navParams.get('userActivityId');
  	this.userActivityEditRef$ = this.database.object(`user-activity/${userActivityId}`);
  	this.userActivityEditRef$.subscribe(userActivity => this.userActivity = userActivity);

    //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
    this.userActivityEditList$ = this.database.list('user-activity')
      .map(_userActivities =>
        _userActivities.filter(userActivity => userActivity.uid == this.userActivity.uid)) as FirebaseListObservable<UserActivity[]>;

    this.userActivityEditList$.subscribe(
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

          let userWMYs = alasql('SELECT uid,fecha, ROUND(DATEDIFF(Week,DATE(fecha), DATE(Date()))) AS totalweeks \
          FROM ? ORDER BY fecha ASC LIMIT 1', [uaData]);
          this.userActivity.week = userWMYs[0].totalweeks;
        }
      });

  }

  //  Update our Firebase node with new item data
  EditUserActivity(userActivity: UserActivity){
    let totalHours = this.sumarHoras(userActivity);
    if(totalHours > 24){
      this.toast.create({
        message:'El total de horas distribuidas ('+totalHours+') no puede ser mayor a 24',
        duration:3000
      }).present();
    }else{
      userActivity.uid_fecha = userActivity.uid+'_'+userActivity.d_fecha;
      this.userActivityEditRef$.update(userActivity);
      //  Send the user back to ShoppingListPage
      this.navCtrl.pop(); 
    }
  }

}
