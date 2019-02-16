import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseListObservable
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//	Imports WhatDoIWant Interface
import { WhatDoIWant } from '../../models/what-do-i-want/what-do-i-want.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserModel } from '../../models/user-model';
//  Import for orderby data from Angular
import "rxjs/add/operator/map";
import 'rxjs/add/operator/take';

@Component({
  selector: 'page-que-quiero',
  templateUrl: 'que-quiero.html',
})
export class WhatDoIWantPage {

  sumarMinutos(whatDoIWant: WhatDoIWant){
    let totalMin = 0;
    totalMin = Number(whatDoIWant.d_suenho_descanso.slice(14,16));
    totalMin = totalMin + Number(whatDoIWant.d_alimento.slice(14,16));
    totalMin = totalMin + Number(whatDoIWant.d_yo_cuerpo.slice(14,16));
    totalMin = totalMin + Number(whatDoIWant.d_yo_mente.slice(14,16));
    totalMin = totalMin + Number(whatDoIWant.d_otros.slice(14,16));
    totalMin = totalMin + Number(whatDoIWant.d_trabajo.slice(14,16));
    totalMin = totalMin + Number(whatDoIWant.d_humanidad.slice(14,16));
    totalMin = totalMin + Number(whatDoIWant.d_pareja.slice(14,16));

    totalMin = totalMin / 60;
    return totalMin;
  }

  sumarHoras(whatDoIWant: WhatDoIWant){ 
    let totalMin = this.sumarMinutos(whatDoIWant);
    let totalHoras = 0;
    totalHoras = Number(whatDoIWant.d_suenho_descanso.slice(11,13));
    totalHoras = totalHoras + Number(whatDoIWant.d_alimento.slice(11,13));
    totalHoras = totalHoras + Number(whatDoIWant.d_yo_cuerpo.slice(11,13));
    totalHoras = totalHoras + Number(whatDoIWant.d_yo_mente.slice(11,13));
    totalHoras = totalHoras + Number(whatDoIWant.d_otros.slice(11,13));
    totalHoras = totalHoras + Number(whatDoIWant.d_trabajo.slice(11,13));
    totalHoras = totalHoras + Number(whatDoIWant.d_humanidad.slice(11,13));
    totalHoras = totalHoras + Number(whatDoIWant.d_pareja.slice(11,13));

    return totalHoras + totalMin;
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

  //	Create a new WhatDoIWant Object
  whatDoIWant = {
    d_suenho_descanso: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_alimento: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_yo_cuerpo: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_yo_mente: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_otros: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_trabajo: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_humanidad: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_pareja: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00"
  } as WhatDoIWant;
  user = {} as UserModel;
  //	Create a new FirebaseListObservable Object
  whatDoIWantRef$: FirebaseListObservable<WhatDoIWant[]>
  whatDoIWantList$: FirebaseListObservable<WhatDoIWant[]>

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private toast: ToastController,
    public alertCtrl: AlertController,
  	private database: AngularFireDatabase) {
  	this.whatDoIWantRef$ = this.database.list('what-do-i-want');
    this.afAuth.authState.subscribe(data => {
      if(data && data.uid){
        this.user.email = data.email;
        this.user.name = data.displayName;
        this.user.photoURL = data.photoURL;
        this.user.uid = data.uid;
        //  Pointing shoppingListRef$ at Firebase -> 'what-do-i-want' node
        this.whatDoIWantList$ = this.database.list('what-do-i-want')
          .map(_whatDoIWants => 
            _whatDoIWants.filter(whatDoIWant => whatDoIWant.uid == data.uid)) as FirebaseListObservable<WhatDoIWant[]>;

        this.whatDoIWantList$.subscribe(
          whatDoIWants => {
            whatDoIWants.map(whatDoIWant => {
              this.whatDoIWant = {
                uid: whatDoIWant.uid,
                d_suenho_descanso: whatDoIWant.d_suenho_descanso,
                d_alimento: whatDoIWant.d_alimento,
                d_yo_cuerpo: whatDoIWant.d_yo_cuerpo,
                d_yo_mente: whatDoIWant.d_yo_mente,
                d_otros: whatDoIWant.d_otros,
                d_trabajo: whatDoIWant.d_trabajo,
                d_humanidad: whatDoIWant.d_humanidad,
                d_pareja: whatDoIWant.d_pareja
              }
            })
          }
        )
      }else{
        this.toast.create({
          message:'No se pudo encontrar detalles de autenticación',
          duration:3000
        }).present();
      }
    });
  }

  WhatDoIWant(whatDoIWant: WhatDoIWant){
    let totalHours = sumarHoras(whatDoIWant);
    let i = 0;
    if(totalHours != 24){
      this.toast.create({
        message:'El total de horas distribuidas ('+totalHours+') debe ser igual a 24',
        duration:3000
      }).present();
    }
    else{
      this.whatDoIWantList$ = this.database.list('what-do-i-want')
      .map(_whatDoIWants => 
          _whatDoIWants.filter(whatDoIWant => whatDoIWant.uid == this.user.uid)) as FirebaseListObservable<WhatDoIWant[]>;
      //  Check if data exists
      this.whatDoIWantList$.subscribe(
        whatDoIWants => {
          if(whatDoIWants.length > 0){
            this.database.list('/what-do-i-want',{
              preserveSnapshot: true,
              query: {
                orderByChild: 'uid',
                equalTo: this.user.uid,
              }
            }).take(1).subscribe(snaphots=> {
              snaphots.forEach((snapshot) => {
                this.database.object('/what-do-i-want/' + snapshot.key).update(this.whatDoIWant);
              }) 
            })
            this.toast.create({
              message:'Actividades actualizadas con exito',
              duration:3000
            }).present(); 
          }else{
            //  Push this to our Firebase database under the 'user-activity' node.
            this.whatDoIWantRef$.push({
              uid: this.user.uid,
              d_suenho_descanso: this.whatDoIWant.d_suenho_descanso,
              d_alimento: this.whatDoIWant.d_alimento,
              d_yo_cuerpo: this.whatDoIWant.d_yo_cuerpo,
              d_yo_mente: this.whatDoIWant.d_yo_mente,
              d_otros: this.whatDoIWant.d_otros,
              d_trabajo: this.whatDoIWant.d_trabajo,
              d_humanidad: this.whatDoIWant.d_humanidad,
              d_pareja: this.whatDoIWant.d_pareja
            });
            i++;
            //  Reset our whatDoIWant
            this.whatDoIWant = {} as WhatDoIWant;
            this.toast.create({
              message:'Actividades registradas con exito',
              duration:3000
            }).present(); 
          }
        }
      );
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

function sumarMinutos(whatDoIWant: WhatDoIWant){
  let totalMin = 0;
  totalMin = Number(whatDoIWant.d_suenho_descanso.slice(14,16));
  totalMin = totalMin + Number(whatDoIWant.d_alimento.slice(14,16));
  totalMin = totalMin + Number(whatDoIWant.d_yo_cuerpo.slice(14,16));
  totalMin = totalMin + Number(whatDoIWant.d_yo_mente.slice(14,16));
  totalMin = totalMin + Number(whatDoIWant.d_otros.slice(14,16));
  totalMin = totalMin + Number(whatDoIWant.d_trabajo.slice(14,16));
  totalMin = totalMin + Number(whatDoIWant.d_humanidad.slice(14,16));
  totalMin = totalMin + Number(whatDoIWant.d_pareja.slice(14,16));

  totalMin = totalMin / 60;
  return totalMin;
}

function sumarHoras(whatDoIWant: WhatDoIWant){ 
  let totalMin = sumarMinutos(whatDoIWant);
  let totalHoras = 0;
  totalHoras = Number(whatDoIWant.d_suenho_descanso.slice(11,13));
  totalHoras = totalHoras + Number(whatDoIWant.d_alimento.slice(11,13));
  totalHoras = totalHoras + Number(whatDoIWant.d_yo_cuerpo.slice(11,13));
  totalHoras = totalHoras + Number(whatDoIWant.d_yo_mente.slice(11,13));
  totalHoras = totalHoras + Number(whatDoIWant.d_otros.slice(11,13));
  totalHoras = totalHoras + Number(whatDoIWant.d_trabajo.slice(11,13));
  totalHoras = totalHoras + Number(whatDoIWant.d_humanidad.slice(11,13));
  totalHoras = totalHoras + Number(whatDoIWant.d_pareja.slice(11,13));

  return totalHoras + totalMin;
}