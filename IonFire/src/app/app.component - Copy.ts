import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from '../providers/auth-service';
import { UserModel } from '../models/user-model';

import { SignInPage } from '../pages/signin/signin';
import { HomePage } from '../pages/home/home';
import { AcercaPage } from "../pages/acerca/acerca";
import { AgregarPage } from "../pages/agregar/agregar";
import { WhatDoIWant2Page } from "../pages/que-quiero2/que-quiero2";

import { TabsPage } from '../pages/tabs/tabs';
import { GuiaPage } from "../pages/guia/guia";

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { UserActivity } from '../models/user-activity/user-activity.interface';
import "rxjs/add/operator/map";
import * as alasql from 'alasql';
import * as moment from 'moment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav: Nav;
  public rootPage:any;

  public pages: Array<{title: string, component: any, icon: string , color: string}>;

  public user = {} as UserModel;

  private isactive = true;
  private j = 0;

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    authService: AuthService,
    database: AngularFireDatabase) {
    // used for an example of ngFor and navigation
    this.rootPage = SignInPage;
    let uaAllData = [];
    let differenceDate = 0;

    this.pages = [
      { title: 'Inicio',        component: HomePage, icon: 'home', color: 'dark' },
      { title: 'Ingresar Tiempos', component: WhatDoIWant2Page, icon: 'ios-book', color: 'dark' },  
      // { title: '24/7', component: AgregarPage, icon: 'add-circle', color: 'dark' },      
      { title: 'Graficos',    component: TabsPage, icon: 'filing', color: 'dark' },/* paper, podium */
      { title: 'Guía rápida',     component: GuiaPage, icon: 'help', color: 'dark' },
      { title: 'Acerca de',     component: AcercaPage, icon: 'information-circle', color: 'dark' }      
    ];

    // subscribe to the authstate, if changed navigate to tabsPage,else if user logout goes to loginpage
    authService.authState.subscribe(user => {
      if(user){
        this.user = authService.userModel;
        this.rootPage = HomePage;
        //  Run the bot
        //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node filter by user loggin
        let uaList = database.list('user-activity')
          .map(_userActivities => 
            _userActivities.filter(userActivity => userActivity.uid == this.user.uid)) as FirebaseListObservable<UserActivity[]>;
        //  Search if have data
        uaList.subscribe(userActivities => {
          if(this.isactive){
            if (userActivities.length > 0) {
              userActivities.map(userActivity => {
                uaAllData.push({
                  "uid": userActivity.uid,
                  "h_suenho_descanso": Number(userActivity.d_suenho_descanso.slice(11,13))+(Number(userActivity.d_suenho_descanso.slice(14,16)) / 60),
                  "h_alimento": Number(userActivity.d_alimento.slice(11,13))+(Number(userActivity.d_alimento.slice(14,16)) / 60),
                  "h_yo_cuerpo": Number(userActivity.d_yo_cuerpo.slice(11,13))+(Number(userActivity.d_yo_cuerpo.slice(14,16)) / 60),
                  "h_yo_mente": Number(userActivity.d_yo_mente.slice(11,13))+(Number(userActivity.d_yo_mente.slice(14,16)) / 60),
                  "h_otros": Number(userActivity.d_otros.slice(11,13))+(Number(userActivity.d_otros.slice(14,16)) / 60),
                  "h_trabajo": Number(userActivity.d_trabajo.slice(11,13))+(Number(userActivity.d_trabajo.slice(14,16)) / 60),
                  "h_humanidad": Number(userActivity.d_humanidad.slice(11,13))+(Number(userActivity.d_humanidad.slice(14,16)) / 60),
                  "h_pareja": Number(userActivity.d_pareja.slice(11,13))+(Number(userActivity.d_pareja.slice(14,16)) / 60),
                  "d_fecha": userActivity.d_fecha,
                  "uid_fecha": userActivity.uid + '_' + userActivity.d_fecha
                });
              });
              //  Sort data by fecha
              uaAllData.sort(function compare(a, b){
                let dateA = +new Date(a.d_fecha);
                let dateB = +new Date(b.d_fecha);
                return dateA - dateB;
              });
              let lastDate = moment(uaAllData[uaAllData.length-1].d_fecha,'YYYY-MM-DD');
              let compareDate = moment(getCurDate(new Date(),2,'-').toISOString().slice(0, 10),'YYYY-MM-DD');
              if(differenceDate == 0)
                differenceDate = compareDate.diff(lastDate,'days');
              if(differenceDate != this.j){
                //  Bot for set average user data 
                if(differenceDate > 0){
                  //  Calculate Average to Items
                  let newUAData = alasql('SELECT uid, \
                  ROUND(AVG(h_suenho_descanso),2) AS h_suenho_descanso, \
                  ROUND(AVG(h_alimento),2) AS h_alimento, \
                  ROUND(AVG(h_yo_cuerpo),2) AS h_yo_cuerpo, \
                  ROUND(AVG(h_yo_mente),2) AS h_yo_mente, \
                  ROUND(AVG(h_otros),2) AS h_otros, \
                  ROUND(AVG(h_trabajo),2) AS h_trabajo, \
                  ROUND(AVG(h_humanidad),2) AS h_humanidad, \
                  ROUND(AVG(h_pareja),2) AS h_pareja \
                  FROM ? GROUP BY uid',[uaAllData]);
                  for(let i =0; i<differenceDate; i++){
                    //  Build object datetime
                    let curDate = getCurDate(new Date(uaAllData[uaAllData.length-1].d_fecha),i+1,'+').toISOString().slice(0, 10);
                    let d_suenho_descanso = curDate+'T'+(Math.trunc(newUAData[0].h_suenho_descanso) < 10 ? '0'+Math.trunc(newUAData[0].h_suenho_descanso): Math.trunc(newUAData[0].h_suenho_descanso))+':'+(convertHourtoMin(newUAData[0].h_suenho_descanso) < 10 ? '0'+convertHourtoMin(newUAData[0].h_suenho_descanso) : convertHourtoMin(newUAData[0].h_suenho_descanso))+':00Z';
                    let d_alimento = curDate+'T'+(Math.trunc(newUAData[0].h_alimento) < 10 ? '0'+Math.trunc(newUAData[0].h_alimento): Math.trunc(newUAData[0].h_alimento))+':'+(convertHourtoMin(newUAData[0].h_alimento) < 10 ? '0'+convertHourtoMin(newUAData[0].h_alimento) : convertHourtoMin(newUAData[0].h_alimento))+':00Z';
                    let d_yo_cuerpo = curDate+'T'+(Math.trunc(newUAData[0].h_yo_cuerpo) < 10 ? '0'+Math.trunc(newUAData[0].h_yo_cuerpo): Math.trunc(newUAData[0].h_yo_cuerpo))+':'+(convertHourtoMin(newUAData[0].h_yo_cuerpo) < 10 ? '0'+convertHourtoMin(newUAData[0].h_yo_cuerpo) : convertHourtoMin(newUAData[0].h_yo_cuerpo))+':00Z';
                    let d_yo_mente = curDate+'T'+(Math.trunc(newUAData[0].h_yo_mente) < 10 ? '0'+Math.trunc(newUAData[0].h_yo_mente): Math.trunc(newUAData[0].h_yo_mente))+':'+(convertHourtoMin(newUAData[0].h_yo_mente) < 10 ? '0'+convertHourtoMin(newUAData[0].h_yo_mente) : convertHourtoMin(newUAData[0].h_yo_mente))+':00Z';
                    let d_otros = curDate+'T'+(Math.trunc(newUAData[0].h_otros) < 10 ? '0'+Math.trunc(newUAData[0].h_otros): Math.trunc(newUAData[0].h_otros))+':'+(convertHourtoMin(newUAData[0].h_otros) < 10 ? '0'+convertHourtoMin(newUAData[0].h_otros) : convertHourtoMin(newUAData[0].h_otros))+':00Z';
                    let d_trabajo = curDate+'T'+(Math.trunc(newUAData[0].h_trabajo) < 10 ? '0'+Math.trunc(newUAData[0].h_trabajo): Math.trunc(newUAData[0].h_trabajo))+':'+(convertHourtoMin(newUAData[0].h_trabajo) < 10 ? '0'+convertHourtoMin(newUAData[0].h_trabajo) : convertHourtoMin(newUAData[0].h_trabajo))+':00Z';
                    let d_humanidad = curDate+'T'+(Math.trunc(newUAData[0].h_humanidad) < 10 ? '0'+Math.trunc(newUAData[0].h_humanidad): Math.trunc(newUAData[0].h_humanidad))+':'+(convertHourtoMin(newUAData[0].h_humanidad) < 10 ? '0'+convertHourtoMin(newUAData[0].h_humanidad) : convertHourtoMin(newUAData[0].h_humanidad))+':00Z';
                    let d_pareja = curDate+'T'+(Math.trunc(newUAData[0].h_pareja) < 10 ? '0'+Math.trunc(newUAData[0].h_pareja): Math.trunc(newUAData[0].h_pareja))+':'+(convertHourtoMin(newUAData[0].h_pareja) < 10 ? '0'+convertHourtoMin(newUAData[0].h_pareja) : convertHourtoMin(newUAData[0].h_pareja))+':00Z';
                    //  Set Data
                    database.list('/user-activity',{
                      preserveSnapshot: true,
                      query: {
                        orderByChild: 'uid_fecha',
                        equalTo: this.user.uid+"_"+curDate,
                      }
                    }).take(1).subscribe(snaphots=> {
                      if(snaphots.length > 0){
                        snaphots.forEach((snapshot) => {
                          console.log("Record exists: "+this.user.uid+"_"+curDate);
                        })
                      }
                      else{
                        uaList.push({
                          uid: newUAData[0].uid,
                          d_suenho_descanso: d_suenho_descanso,
                          d_alimento: d_alimento,
                          d_yo_cuerpo: d_yo_cuerpo,
                          d_yo_mente: d_yo_mente,
                          d_otros: d_otros,
                          d_trabajo: d_trabajo,
                          d_humanidad: d_humanidad,
                          d_pareja: d_pareja,
                          d_fecha: curDate,
                          uid_fecha: newUAData[0].uid+'_'+curDate
                        });
                      }
                    })
                    this.j++;
                  }
                  this.isactive = false;
                }
              }
            }
          }
        });
      } else {
        this.rootPage = SignInPage;
      }
    })

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goToPage(page){
    this.nav.setRoot(page);  
  }
}

function convertHourtoMin(value){
  return Math.round(Number((value % 1).toFixed(2)) * 60);
}

function getCurDate(fecha, dias, operando) {
  if (operando == '+')
    fecha.setDate(fecha.getDate() + dias);
  else
    fecha.setDate(fecha.getDate() - dias);
  return fecha;
}