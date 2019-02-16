import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseListObservable
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//	Imports WhatDoIWant Interface
import { WhatDoIWant2 } from '../../models/what-do-i-want2/what-do-i-want2.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserModel } from '../../models/user-model';
//  Import for orderby data from Angular
import "rxjs/add/operator/map";
import 'rxjs/add/operator/take';


/**
 * Generated class for the QueQuiero2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-que-quiero2',
  templateUrl: 'que-quiero2.html',
})
export class WhatDoIWant2Page {

  tooltips(e, type) {

    let title = "";
    let subtitle = "";

    switch (type) {
      case 's':
        title = "Sueño";
        subtitle = "Actividades relacionadas con dormir: Soñar, conciliar el sueño, tomar una siesta, etc.";
        break;
      case 'a':
        title = "Alimento";
        subtitle = "Actividades relacionadas con la comida: Cocina, siembra, mercado, medicina, etc.";
        break;
      case 'c':
        title = "Yo Cuerpo";
        subtitle = "Actividades relacionadas con el bienestar corporal: Ejercicio, salud, higiene, etc.";
        break;
      case 'm':
        title = "Yo Mente";
        subtitle = "Actividades para ejercitar el cerebro y la memoria: Leer, aprender un idioma, música, ocio, etc.";
        break;
      case 'o':
        title = "Otros";
        subtitle = "Actividades dedicadas a las relaciones humanas: Hablar con otros, familia, amigos, conocer nuevas personas, etc.";
        break;
      case 't':
        title = "Trabajo";
        subtitle = "Actividades que impliquen un esfuerzo productivo: Tareas domésticas, empleo, estudio, etc.";
        break;
      case 'h':
        title = "Humanidad";
        subtitle = "Actos que te recuerden que eres un ser humano: Observar la naturaleza, ayudar al otro, orar o meditar, caminar, viajar, etc.";
        break;
      case 'p':
        title = "Pareja";
        subtitle = "Actividades que realizas con quien compartes todo en tu vida. Escuchar, intimar, resolver problemas, etc. (Si no tienes pareja puede quedar en 0)";
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
    d_suenho_descanso: "",
    d_alimento: "",
    d_yo_cuerpo: "",
    d_yo_mente: "",
    d_otros: "",
    d_trabajo: "",
    d_humanidad: "",
    d_pareja: ""
  } as WhatDoIWant2;
  user = {} as UserModel;
  //	Create a new FirebaseListObservable Object
  whatDoIWantRef$: FirebaseListObservable<WhatDoIWant2[]>
  whatDoIWantList$: FirebaseListObservable<WhatDoIWant2[]>

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private toast: ToastController,
    public alertCtrl: AlertController,
    private database: AngularFireDatabase) {
    this.whatDoIWantRef$ = this.database.list('what-do-i-want2');
    this.afAuth.authState.subscribe(data => {
      if (data && data.uid) {
        this.user.email = data.email;
        this.user.name = data.displayName;
        this.user.photoURL = data.photoURL;
        this.user.uid = data.uid;
        //  Pointing shoppingListRef$ at Firebase -> 'what-do-i-want' node
        this.whatDoIWantList$ = this.database.list('what-do-i-want2')
          .map(_whatDoIWants =>
            _whatDoIWants.filter(whatDoIWant => whatDoIWant.uid == data.uid)) as FirebaseListObservable<WhatDoIWant2[]>;

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
      } else {
        this.toast.create({
          message: 'No se pudo encontrar detalles de autenticación',
          duration: 3000
        }).present();
      }
    });
  }

  WhatDoIWant(whatDoIWant2: WhatDoIWant2) {
    let i = 0;
    
    this.whatDoIWantList$ = this.database.list('what-do-i-want2')
      .map(_whatDoIWants =>
        _whatDoIWants.filter(whatDoIWant => whatDoIWant.uid == this.user.uid)) as FirebaseListObservable<WhatDoIWant2[]>;
    //  Check if data exists
    this.whatDoIWantList$.subscribe(
      whatDoIWants => {
        if (whatDoIWants.length > 0) {
          this.database.list('/what-do-i-want2', {
            preserveSnapshot: true,
            query: {
              orderByChild: 'uid',
              equalTo: this.user.uid,
            }
          }).take(1).subscribe(snaphots => {
            snaphots.forEach((snapshot) => {
              this.database.object('/what-do-i-want2/' + snapshot.key).update(this.whatDoIWant);
            })
          })
          this.toast.create({
            message: 'Actividades actualizadas con exito',
            duration: 3000
          }).present();
        } else {
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
          this.whatDoIWant = {} as WhatDoIWant2;
          this.toast.create({
            message: 'Actividades registradas con exito',
            duration: 3000
          }).present();
        }
      }
    );
  }

}