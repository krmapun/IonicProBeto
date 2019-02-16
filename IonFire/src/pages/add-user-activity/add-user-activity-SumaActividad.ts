import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseListObservable
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//	Imports UserActivity Interface
import { UserActivity } from '../../models/user-activity/user-activity.interface';
//  Imports WhatDoIWant Interface
import { WhatDoIWant } from '../../models/what-do-i-want/what-do-i-want.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserModel } from '../../models/user-model';
//  Import for orderby data from Angular
import "rxjs/add/operator/map";
import * as alasql from 'alasql';

@Component({
  selector: 'page-add-user-activity',
  templateUrl: 'add-user-activity.html',
})
export class AddUserActivityPage {

  getCurDate(fecha,dias,operando){
    if(operando == '+')
      fecha.setDate(fecha.getDate() + dias);
    else
      fecha.setDate(fecha.getDate() - dias);
    return fecha;
  }

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

  sumaactividad(actividad_,suma,div,cp){
    let horaActividad=Number(actividad_.slice(11,13));
    let minutoactividad=Number(actividad_.slice(14,16))/60;
    let nhoraformateada ;
    let nminutoformateado ;
    let tiempoformateado;
    let nuevahora;
    let nhora;
    let nminuto;

    if(cp==0){
      nuevahora=(horaActividad+minutoactividad)+(suma/div);
      nhora=Math.trunc(nuevahora);
      nminuto = Number((nuevahora-nhora).toFixed(2));
    }
    else
    {
      if(div==6) 
      {
        nuevahora=(horaActividad+minutoactividad);
        nhora=Math.trunc(nuevahora);
        nminuto = Number((nuevahora-nhora).toFixed(2));
        
      }
      else{ // pareja es mayor que 0
        nuevahora=(horaActividad+minutoactividad)+(suma/div);
        nhora=Math.trunc(nuevahora);
        nminuto = Number((nuevahora-nhora).toFixed(2));
       // console.log(nuevahora);
        
      }
      
    }
      
    //console.log(nminuto);
    //console.log(nhora.toString().length);
    
    //// ASEGURAR EL MANEJO DE LOS FORMATOS... YA CASI LO TENGO...
    if(nhora.toString().length<2)
      nhoraformateada = '0'+nhora.toString();
      else
      nhoraformateada = nhora.toString();
    
    if(nminuto==0)
      nminutoformateado='00';
    else  
      nminutoformateado = Math.round(nminuto*60);

    if(nminutoformateado.toString().length<2)
      nminutoformateado = '0'+nminutoformateado.toString();
     

    tiempoformateado = nhoraformateada+':'+nminutoformateado.toString();
    //actividad_ = actividad_.slice(0,11)+nuevahora
    actividad_ = actividad_.slice(0,11)+tiempoformateado;
    return actividad_;

  }

  divisor(a){
    let pareja;

    pareja =  Number(a.slice(11,13))+Number(a.slice(14,16));
    //console.log('PAREJA'+pareja);
    if (pareja > 0)
      return 7;
    else 
      return 6;
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
        subtitle ="Actividades que realizas con quien compartes todo en tu vida. Asimismo, escuchar, intimar, resolver problemas, si no tienes pareja dejarla en cero etc.";
        //subtitle =this.getCurDate(new Date(),0,'+')
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
  userActivity = {
    d_suenho_descanso: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_alimento: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_yo_cuerpo: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_yo_mente: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_otros: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_trabajo: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_humanidad: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_pareja: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00"
  } as UserActivity;
  user = {} as UserModel;
  //  Current week Activities
  curweek = 0;
  //	Create a new FirebaseListObservable Object
  userActivityAddRef$: FirebaseListObservable<UserActivity[]>
  userActivityAddList$: FirebaseListObservable<UserActivity[]>
  whatDoIWantList$: FirebaseListObservable<WhatDoIWant[]>

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private toast: ToastController,
    public alertCtrl: AlertController,
  	private database: AngularFireDatabase) {

    let uaData = [];

  	this.userActivityAddRef$ = this.database.list('user-activity');
    this.afAuth.authState.subscribe(data => {
      if(data && data.uid){
        this.user.email = data.email;
        this.user.name = data.displayName;
        this.user.photoURL = data.photoURL;
        this.user.uid = data.uid;
        //  Search what-do-i-want data
        //  Pointing shoppingListRef$ at Firebase -> 'what-do-i-want' node
        // this.whatDoIWantList$ = this.database.list('what-do-i-want')
        //   .map(_whatDoIWants => 
        //     _whatDoIWants.filter(whatDoIWant => whatDoIWant.uid == data.uid)) as FirebaseListObservable<WhatDoIWant[]>;

        // this.whatDoIWantList$.subscribe(
        //   whatDoIWants => {
        //     if(whatDoIWants.length == 0){
        //       this.toast.create({
        //         message:'No es posible registrar la actividad porque debe registrar primero las actividades en la sección ¿Qué Quiero?',
        //         duration:3000
        //       }).present();
        //       //  Navigate the user back to the AyerPage
        //       this.navCtrl.pop();
        //     }
        //   }
        // )

        //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
        this.userActivityAddList$ = this.database.list('user-activity')
          .map(_userActivities =>
            _userActivities.filter(userActivity => userActivity.uid == data.uid)) as FirebaseListObservable<UserActivity[]>;

        this.userActivityAddList$.subscribe(
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
              this.curweek = userWMYs[0].totalweeks;
            }
          });

      }else{
        this.toast.create({
          message:'No se pudo encontrar detalles de autenticación',
          duration:3000
        }).present();
      }
    });
  }

  myDate: String = this.getCurDate(new Date(),0,'+').toISOString().slice(0, 10);
  minDate: String = this.getCurDate(new Date(),1,'-').toISOString().slice(0, 10);
  maxDate: String = this.getCurDate(new Date(),0,'+').toISOString().slice(0, 10);

  UserActivity(userActivity: UserActivity){
    let totalHours = this.sumarHoras(userActivity);
    let diferencia =  24 - totalHours;//**  diferencia en horas*/
    let i = 0;
    if(totalHours == 0){
      this.toast.create({
        message:'El total de horas distribuidas ('+totalHours+') debe ser mayor a 0',
        duration:3000
      }).present();
    }
    else if(totalHours > 24){
      this.toast.create({
        message:'El total de horas distribuidas ('+totalHours+') no puede ser mayor a 24',
        duration:3000
      }).present();
    }
    else{
      this.userActivityAddList$ = this.database.list('user-activity')
      .map(_userActivities => 
          _userActivities.filter(userActivity => userActivity.uid_fecha == this.user.uid+'_'+this.myDate)) as FirebaseListObservable<UserActivity[]>;
      //  Check if data exists
      this.userActivityAddList$.subscribe(
        userActivities => {
          if(userActivities.length > 0){
            if(i==0){
              this.toast.create({
                message:'No es posible registrar la actividad porque ya existe una actividad para el día seleccionado',
                duration:3000
              }).present(); 
            }
            i++;
          }else{
/*  AQUI DEBERIA MONTAR EL CODIGO QUE ME VALIDE LA ACTIVIDAD DEL DIA ANTERIOR
          this.userActivityAddList$ = this.database.list('user-activity')
            .map(_userActivities => 
                _userActivities.filter(userActivity => userActivity.uid_fecha == this.user.uid+'_'+this.minDate)) as FirebaseListObservable<UserActivity[]>;
            
*/
            let div=this.divisor(this.userActivity.d_pareja);
            //console.log(div);
            //  Push this to our Firebase database under the 'user-activity' node.
            this.userActivityAddRef$.push({
              uid: this.user.uid,
              d_suenho_descanso: this.userActivity.d_suenho_descanso,
              d_alimento: this.sumaactividad(this.userActivity.d_alimento,diferencia,div,0),
              //d_yo_cuerpo: this.userActivity.d_yo_cuerpo,
              d_yo_cuerpo: this.sumaactividad(this.userActivity.d_yo_cuerpo,diferencia,div,0),
              d_yo_mente: this.sumaactividad(this.userActivity.d_yo_mente,diferencia,div,0),
              d_otros: this.sumaactividad(this.userActivity.d_otros,diferencia,div,0),
              d_trabajo: this.sumaactividad(this.userActivity.d_trabajo,diferencia,div,0),
              d_humanidad: this.sumaactividad(this.userActivity.d_humanidad,diferencia,div,0),
              d_pareja: this.sumaactividad(this.userActivity.d_pareja,diferencia,div,1),
              d_fecha: this.myDate,
              uid_fecha: this.user.uid+'_'+this.myDate,
              week: this.curweek
            });
            i++;
            //  Reset our userActivity
            this.userActivity = {
              d_suenho_descanso: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
              d_alimento: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
              d_yo_cuerpo: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
              d_yo_mente: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
              d_otros: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
              d_trabajo: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
              d_humanidad: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
              d_pareja: this.getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00"
            } as UserActivity;
            //  Navigate the user back to the AyerPage
            this.navCtrl.pop();
          }
        }
      );
    }
  }


  ionViewWillLoad() {
    let msg = "Recuerda completar las 24 horas en ambos días para una mayor precisión en tus gráficas";
    //  Send messages to welcome          
    this.toast.create({
      message: msg,
      duration: 3000
    }).present();
  }

}