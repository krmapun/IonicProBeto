import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseListObservable
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//  Imports UserActivity Interface
import { UserActivity } from '../../models/user-activity/user-activity.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserModel } from '../../models/user-model';
//  Import for orderby data from Angular
import "rxjs/add/operator/map";
//  Import AlaSQL
import * as alasql from 'alasql';
import { DYNAMIC_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'page-chart-line',
  templateUrl: 'chart-line.html',
})
export class ChartLinePage {
  chartOptions: any;
  userActivityCharLineList$: FirebaseListObservable<UserActivity[]>;
  user = {} as UserModel;

  f_actual = new Date();

  filter = 'M';
  div = '7';
  limit=4;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private database: AngularFireDatabase) {

    let charData = [];

    this.afAuth.authState.subscribe(data => {
      this.user.uid = data.uid;
      //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
      this.userActivityCharLineList$ = this.database.list('user-activity')
        .map(_userActivities => 
          _userActivities.filter(userActivity => userActivity.uid == data.uid)) as FirebaseListObservable<UserActivity[]>;

      //  Build data for chart Line for Current Month
      this.userActivityCharLineList$.subscribe(
        userActivities => {
          if(userActivities.length > 0){
            userActivities.map(userActivity => {
              let d = new Date();
              let startDate = null;
              let endDate = null;
             
              if(this.filter == "M"){
                let name = "Semana";
                //startDate = new Date(d.getFullYear(), d.getMonth()-1,0);
                //endDate = new Date(d.getFullYear(), d.getMonth()+1,0); 
                endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                startDate = date_by_subtracting_days(endDate, 27);
               // console.log('AQUI FUE '+startDate)
                this.div='7';
                this.limit=4;
                //startDate = new Date(d.getFullYear(), d.getMonth(), d.getDate()-20)
              }
              else if(this.filter == "Y"){
                endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                startDate = date_by_subtracting_days(endDate, 83);
                this.div='28';
                this.limit=13;
              }
              else{
                startDate = new Date(d.getFullYear()-3, d.getMonth(), d.getDate());
                endDate = new Date(d.getFullYear(), d.getMonth()+1, d.getDate());
                startDate = date_by_subtracting_days(endDate, 363);
                this.div='364';
                this.limit=3;
              }
              //console.log('AQUI FUE '+userActivity.d_fecha);
              if(validate_fechaBetween(userActivity.d_fecha,dateFormat(startDate),dateFormat(endDate)) ==1){  
                let name = "";
                if(this.filter =="M"){
                  
                  //name = userActivity.d_fecha
                  name = 'Semana ';
                  this.div='7';
                  this.limit=4;
                }
                else if(this.filter == "Y"){
                  //name = getMonthName(Number(userActivity.d_fecha.slice(5,7))-1);
                  name = 'Mes ';
                  this.div='28';
                  this.limit=3;
                }
                else{
                  name = 'Trimestre ';
                  this.div='84';
                  this.limit=13;
                }
                //console.log('AQUI FUE '+userActivity.d_fecha);
                charData.push({
                  "name" : name,
                  "fecha": userActivity.d_fecha,
                  "div":this.div,
                  "l":this.limit,
                  //  ['Descanso', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
                  "activities" : [
                    getHour(userActivity.d_suenho_descanso),
                    getHour(userActivity.d_alimento),
                    getHour(userActivity.d_yo_cuerpo),
                    getHour(userActivity.d_yo_mente),
                    getHour(userActivity.d_otros),
                    getHour(userActivity.d_trabajo),
                    getHour(userActivity.d_humanidad),
                    getHour(userActivity.d_pareja)
                  ]
                });
              }
            })          
            let res = alasql('SELECT  name, cast((DATEDIFF(day,DATE(fecha),DATE(Date()))/div) as int)+1 as t,\
            ROUND(avg(activities -> 0),2) AS descanso,  ROUND(avg(activities -> 1),2) AS alimento, \
            ROUND(avg(activities -> 2),2) AS yo_cuerpo, ROUND(avg(activities -> 3),2) AS yo_mente, ROUND(avg(activities -> 4),2) AS otros, \
            ROUND(avg(activities -> 5),2) AS trabajo, ROUND(avg(activities -> 6),2) AS humanidad, ROUND(avg(activities -> 7),2) AS pareja \
            FROM ? \
            GROUP BY name, cast((DATEDIFF(day,DATE(fecha),DATE(Date()))/div) as int)+1\
            ORDER BY t desc, name asc ',[charData]);

            //  Build array of object for chart
            let chartdata = [];
            //console.log('AQUI FUE '+[charData]);
            //  Set Number Magic
            /*chartdata.push({
              type: 'area',
              name: 'Vibra Natural',
              data: [6,6,6,6,6,6,6,6]
            },
            {
              type: 'area',
              name: 'Vibra Natural',
              data: [0,0,0,0,0,0,0,0]
            });*/

            for(let i = 0; i < res.length; i++){
              chartdata.push({
                type: 'line',
                name: res[i].name.concat(i+1),
               //
                data: [
                  res[i].descanso,res[i].alimento,res[i].yo_cuerpo,res[i].yo_mente,
                  res[i].otros,res[i].trabajo,res[i].humanidad,res[i].pareja,
                ],
                
              })
            }

            let subtitle = "";

            switch(this.filter){
              case 'M':
                subtitle = 'Últimos 28 días ';
                break;
              case 'Y':
                subtitle = 'Últimos 3 meses';
                break;
              case 'T':
                subtitle = 'Último año';
                break;
            }

            //  Build Chart
            this.chartOptions = {
              chart: {
                type: 'line'
              },
              title: {
                text: 'Vibra'
              },
              subtitle: {
                text: subtitle
              },
              xAxis: {
                //'Salud',
                categories: ['Sueño',  'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja'],
                labels: {
                  formatter: function () {
                    switch(this.value){
                      case 'Sueño': 
                        return '<span style="fill: #442662;">' + this.value + '</span>';
                      case 'Alimento': 
                        return '<span style="fill: #0CB7F2;">' + this.value + '</span>';
                      case 'Cuerpo': 
                        return '<span style="fill: #009D71;">' + this.value + '</span>';
                      case 'Mente': 
                        return '<span style="fill: #009D71;">' + this.value + '</span>';
                      case 'Otros': 
                        return '<span style="fill: #FFD700;">' + this.value + '</span>';
                      case 'Trabajo': 
                        return '<span style="fill: #E87B31;">' + this.value + '</span>';
                      case 'Humanidad': 
                        return '<span style="fill: #C0C0C0;">' + this.value + '</span>';
                      case 'Pareja': 
                        return '<span style="fill: #CB1D11;">' + this.value + '</span>';
                    }
                  }
                }
              },
              yAxis: {
                title: {
                  text: 'No. Horas'
                }
              },
              credits: {
                 enabled: false
              },
              series: chartdata
            }
          }
          else{
            let subtitle = "";

            switch(this.filter){
              case 'M':
                subtitle = 'Últimos 28 días';
                break;
              case 'Y':
                subtitle = 'Últimos 3 meses';
                break;
              case 'T':
                subtitle = 'Último año';
                break;
            }

            //  Build Chart
            this.chartOptions = {
              chart: {
                type: 'line'
              },
              title: {
                text: 'Vibra'
              },
              subtitle: {
                text: subtitle
              },
              xAxis: {
                //'Salud',
                categories: ['Sueño',  'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja'],
                labels: {
                  formatter: function () {
                    switch(this.value){
                      case 'Sueño': 
                        return '<span style="fill: #442662;">' + this.value + '</span>';
                      case 'Alimento': 
                        return '<span style="fill: #0CB7F2;">' + this.value + '</span>';
                      case 'Cuerpo': 
                        return '<span style="fill: #009D71;">' + this.value + '</span>';
                      case 'Mente': 
                        return '<span style="fill: #009D71;">' + this.value + '</span>';
                      case 'Otros': 
                        return '<span style="fill: #FFD700;">' + this.value + '</span>';
                        case 'Trabajo': 
                        return '<span style="fill: #E87B31;">' + this.value + '</span>';
                      case 'Humanidad': 
                        return '<span style="fill: #C0C0C0;">' + this.value + '</span>';
                      case 'Pareja': 
                        return '<span style="fill: #CB1D11;">' + this.value + '</span>';
                    }
                  }
                }
              },
              yAxis: {
                title: {
                  text: 'No. Horas'
                }
              },
              credits: {
                 enabled: false
              },
              series: []
            }
          }
        }
      );
      //  End chart Line for Current Month
    });
  }

  onSelectChange(selectedValue: any) {
    this.filter = selectedValue;

    let charData = [];
    //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
    this.userActivityCharLineList$ = this.database.list('user-activity')
      .map(_userActivities => 
        _userActivities.filter(userActivity => userActivity.uid == this.user.uid)) as FirebaseListObservable<UserActivity[]>;

    //  Build data for chart Line for Current Month
    this.userActivityCharLineList$.subscribe(
      userActivities => {
        if(userActivities.length > 0){
          userActivities.map(userActivity => {
            let d = new Date();
            let startDate = null;
            let endDate = null;
           
            if(this.filter == "M"){
              let name = "Semana ";
              //startDate = new Date(d.getFullYear(), d.getMonth()-1,0);
              //endDate = new Date(d.getFullYear(), d.getMonth()+1,0); 
              endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
              startDate = date_by_subtracting_days(endDate, 27);
              this.div='7';
              this.limit=4;
              //startDate = new Date(d.getFullYear(), d.getMonth(), d.getDate()-20)
            }
            else if(this.filter == "Y"){
              endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
              startDate = date_by_subtracting_days(endDate, 83); 
              this.div='28';
              this.limit=13;
            }
            else{
              //startDate = new Date(d.getFullYear()-3, d.getMonth(), d.getDate());
              endDate = new Date(d.getFullYear(), d.getMonth()+1, d.getDate());
              startDate = date_by_subtracting_days(endDate, 363); 
              this.div='364';
              this.limit=3;
            }
            //console.log('AQUI FUE '+userActivity.d_fecha);
            if(validate_fechaBetween(userActivity.d_fecha,dateFormat(startDate),dateFormat(endDate)) ==1){  
              let name = "";
              if(this.filter =="M"){
                
                //name = userActivity.d_fecha
                name = 'Semana ';
                this.div='7';
                this.limit=4;
              }
              else if(this.filter == "Y"){
                name = 'Mes ';
                this.div='28';
                this.limit=13;
              }
              else{
                name = 'Trimestre ';
                this.div='364';
                this.limit=3;
              }
              charData.push({
                "name" : name,
                "fecha": userActivity.d_fecha,
                "div":this.div,
                "l":this.limit,
                //  ['Descanso', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
                "activities" : [
                  getHour(userActivity.d_suenho_descanso),
                  getHour(userActivity.d_alimento),
                  getHour(userActivity.d_yo_cuerpo),
                  getHour(userActivity.d_yo_mente),
                  getHour(userActivity.d_otros),
                  getHour(userActivity.d_trabajo),
                  getHour(userActivity.d_humanidad),
                  getHour(userActivity.d_pareja)
                ]
              });
            }
          })          
          let res = alasql('SELECT  name, cast((DATEDIFF(day,DATE(fecha),DATE(Date()))/div) as int)+1 as t,\
          ROUND(avg(activities -> 0),2) AS descanso,  ROUND(avg(activities -> 1),2) AS alimento, \
          ROUND(avg(activities -> 2),2) AS yo_cuerpo, ROUND(avg(activities -> 3),2) AS yo_mente, ROUND(avg(activities -> 4),2) AS otros, \
          ROUND(avg(activities -> 5),2) AS trabajo, ROUND(avg(activities -> 6),2) AS humanidad, ROUND(avg(activities -> 7),2) AS pareja \
          FROM ? \
          GROUP BY name, cast((DATEDIFF(day,DATE(fecha),DATE(Date()))/div) as int)+1\
          ORDER BY t desc, name asc ',[charData]);

          //  Build array of object for chart
          let chartdata = [];

          //  Set Number Magic
          /*chartdata.push({
            type: 'area',
            name: 'Vibra Natural',
            data: [6,6,6,6,6,6,6,6]
          },
          {
            type: 'area',
            name: 'Vibra Natural',
            data: [0,0,0,0,0,0,0,0]
          });*/

          for(let i = 0; i < res.length; i++){
            chartdata.push({
              type: 'line',
              name: res[i].name.concat(i+1),
             //
              data: [
                res[i].descanso,res[i].alimento,res[i].yo_cuerpo,res[i].yo_mente,
                res[i].otros,res[i].trabajo,res[i].humanidad,res[i].pareja,
              ],
              
            })
          }

          let subtitle = "";

          switch(this.filter){
            case 'M':
              subtitle = 'Últimos 28 días';
              break;
            case 'Y':
              subtitle = 'Últimos 3 meses';
              break;
            case 'T':
              subtitle = 'Último año';
              break;
          }

          //  Build Chart
          this.chartOptions = {
            chart: {
              type: 'line'
            },
            title: {
              text: 'Vibra'
            },
            subtitle: {
              text: subtitle
            },
            xAxis: {
              //'Salud',
              categories: ['Sueño',  'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja'],
              labels: {
                formatter: function () {
                  switch(this.value){
                    case 'Sueño': 
                      return '<span style="fill: #442662;">' + this.value + '</span>';
                    case 'Alimento': 
                      return '<span style="fill: #0CB7F2;">' + this.value + '</span>';
                    case 'Cuerpo': 
                      return '<span style="fill: #009D71;">' + this.value + '</span>';
                    case 'Mente': 
                      return '<span style="fill: #009D71;">' + this.value + '</span>';
                    case 'Otros': 
                      return '<span style="fill: #FFD700;">' + this.value + '</span>';
                      case 'Trabajo': 
                      return '<span style="fill: #E87B31;">' + this.value + '</span>';
                    case 'Humanidad': 
                      return '<span style="fill: #C0C0C0;">' + this.value + '</span>';
                    case 'Pareja': 
                      return '<span style="fill: #CB1D11;">' + this.value + '</span>';
                  }
                }
              }
            },
            yAxis: {
              title: {
                text: 'No. Horas'
              }
            },
            credits: {
               enabled: false
            },
            series: chartdata
          }
        }
        else{
          let subtitle = "";

          switch(this.filter){
            case 'M':
              subtitle = 'Últimos 28 días';
              break;
            case 'Y':
              subtitle = 'Últimos 3 meses';
              break;
            case 'T':
              subtitle = 'Último año';
              break;
          }

          //  Build Chart
          this.chartOptions = {
            chart: {
              type: 'line'
            },
            title: {
              text: 'Vibra'
            },
            subtitle: {
              text: subtitle
            },
            xAxis: {
              //'Salud',
              categories: ['Sueño',  'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja'],
              labels: {
                formatter: function () {
                  switch(this.value){
                    case 'Sueño': 
                      return '<span style="fill: #442662;">' + this.value + '</span>';
                    case 'Alimento': 
                      return '<span style="fill: #0CB7F2;">' + this.value + '</span>';
                    case 'Cuerpo': 
                      return '<span style="fill: #009D71;">' + this.value + '</span>';
                    case 'Mente': 
                      return '<span style="fill: #009D71;">' + this.value + '</span>';
                    case 'Otros': 
                      return '<span style="fill: #FFD700;">' + this.value + '</span>';
                      case 'Trabajo': 
                      return '<span style="fill: #E87B31;">' + this.value + '</span>';
                    case 'Humanidad': 
                      return '<span style="fill: #C0C0C0;">' + this.value + '</span>';
                    case 'Pareja': 
                      return '<span style="fill: #CB1D11;">' + this.value + '</span>';
                  }
                }
              }
            },
            yAxis: {
              title: {
                text: 'No. Horas'
              }
            },
            credits: {
               enabled: false
            },
            series: []
          }
        }
      }
    );
    //  End chart Line for Current Month
  }

}

function getMonthName(month_number){
  var month = new Array();
  month[0] = "Enero";
  month[1] = "Febrero";
  month[2] = "Marzo";
  month[3] = "Abril";
  month[4] = "Mayo";
  month[5] = "Junio";
  month[6] = "Julio";
  month[7] = "Agosto";
  month[8] = "Septiembre";
  month[9] = "Octubre";
  month[10] = "Noviembre";
  month[11] = "Diciembre";
  return month[month_number];
}

function validate_fechaBetween(fecha,fechaInicial,fechaFinal)
{
  let valuesCompare=fecha.split("-");
  let valuesStart=fechaInicial.split("-");
  let valuesEnd=fechaFinal.split("-");
  // Verificamos que la fecha no sea posterior a la actual
  
  //var dateCompare=Number(valuesCompare[0]+(valuesCompare[1]<10 ? '0'+valuesCompare[1] : valuesCompare[1])+(valuesCompare[2]<10 ? '0'+valuesCompare[2] : valuesCompare[2]));
 // var dateStart=Number(valuesStart[0]+(valuesStart[1]<10 ? '0'+valuesStart[1] : valuesStart[1])+(valuesStart[2]<10 ? '0'+valuesStart[2] : valuesStart[2]));
  //var dateEnd=Number(valuesEnd[0]+(valuesEnd[1]<10 ? '0'+valuesEnd[1] : valuesEnd[1])+(valuesEnd[2]<10 ? '0'+valuesEnd[2] : valuesEnd[2]));
  var dateCompare=Number(valuesCompare[0])*10000+Number(valuesCompare[1])*100+Number(valuesCompare[2]);
  var dateStart=Number(valuesStart[0])*10000+Number(valuesStart[1])*100+Number(valuesStart[2]);
  var dateEnd=Number(valuesEnd[0])*10000+Number(valuesEnd[1])*100+Number(valuesEnd[2]);

  //console.log('DC: '+dateCompare+' FI: '+dateStart+' FF: '+dateEnd);
  if(dateCompare>=dateStart && dateCompare <=dateEnd)
  {
    return 1;
  }
  return 0;
}

function dateFormat(fecha){
  var dia = fecha.getDate();
  var mes = fecha.getMonth()+1;
  var yyyy = fecha.getFullYear();
  var fecha_formateada = yyyy + '-' + mes + '-' + dia;
  return fecha_formateada;
}

function getHour(concept){
  let totalHour = Number(concept.slice(11,13));
  let totalMin = Number(concept.slice(14,16));

  return totalHour + (totalMin / 60);
}

function date_by_subtracting_days(date, days) {
  return new Date(
      date.getFullYear(), 
      date.getMonth(), 
      date.getDate() - days
   );
}