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

@Component({
  selector: 'page-chart-pie',
  templateUrl: 'chart-pie.html',
})
export class ChartPiePage {
  chartOptions: any;
  userActivityCharPieList$: FirebaseListObservable<UserActivity[]>;
  user = {} as UserModel;

  f_actual = new Date();

  filter = 'M';
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private database: AngularFireDatabase) {

    let charData = [];

    this.afAuth.authState.subscribe(data => {
      this.user.uid = data.uid;
      //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
      this.userActivityCharPieList$ = this.database.list('user-activity')
        .map(_userActivities => 
          _userActivities.filter(userActivity => userActivity.uid == data.uid)) as FirebaseListObservable<UserActivity[]>;

      //  Build data for chart Line for Current Month
      this.userActivityCharPieList$.subscribe(
        userActivities => {
          if(userActivities.length > 0){
            userActivities.map(userActivity => {
              let d = new Date();
              let startDate = null;
              let endDate = null;
              if(this.filter == "M"){
                endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                startDate = date_by_subtracting_days(endDate, 28);
                
              }
              else if(this.filter == "Y"){
                //endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                //startDate = date_by_subtracting_days(endDate, 364);
                startDate = date_by_subtracting_days(endDate, 28*3);
          
              }
              else{
                //startDate = new Date(d.getFullYear()-3, d.getMonth(), d.getDate());
                startDate = date_by_subtracting_days(endDate, 28*13);
                endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
               
              }
              if(validate_fechaBetween(userActivity.d_fecha,dateFormat(startDate),dateFormat(endDate)) == 1){
                //  ['Descanso', 'Salud', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
                charData.push({
                  "name" : 'Sueño',
                  "y" : getHour(userActivity.d_suenho_descanso)
                });
                charData.push({
                  "name" : 'Alimento',
                  "y" : getHour(userActivity.d_alimento)
                });
                charData.push({
                  "name" : 'Cuerpo',
                  "y" : getHour(userActivity.d_yo_cuerpo)
                });
                charData.push({
                  "name" : 'Mente',
                  "y" : getHour(userActivity.d_yo_mente)
                });
                charData.push({
                  "name" : 'Otros',
                  "y" : getHour(userActivity.d_otros)
                });
                charData.push({
                  "name" : 'Trabajo',
                  "y" : getHour(userActivity.d_trabajo)
                });
                charData.push({
                  "name" : 'Humanidad',
                  "y" : getHour(userActivity.d_humanidad)
                });
                charData.push({
                  "name" : 'Pareja',
                  "y" : getHour(userActivity.d_pareja)
                });
              }
            })

            let res = alasql('SELECT name, sum(y) AS y \
            FROM ? \
            GROUP BY name \
            ORDER BY sum(y) ASC',[charData]);

            for(let i=0;i<res.length;i++){
                res[i].data = res[i].y;
                switch(res[i].name){
                  case "Sueño":
                    res[i].color = '#442662';
                    break;
                  case "Alimento":
                    res[i].color = '#0CB7F2';
                    break;
                  case "Cuerpo":
                    res[i].color = '#009D71';
                    break;
                  case "Mente":
                    res[i].color = '#009D71';
                    break;
                  case "Otros":
                    res[i].color = '#FFD700';
                    break;
                  case "Trabajo":
                    res[i].color = '#E87B31';
                    break;
                  case "Humanidad":
                    res[i].color = '#C0C0C0';
                    break;
                  case "Pareja":
                    res[i].color = '#CB1D11';
                    break;
                }
              }

            let subtitle = "";
            switch(this.filter){
              case 'M':
                //subtitle = getMonthName(this.f_actual.getMonth())+ " "+this.f_actual.getFullYear();
                subtitle ='Últimos 28 días';
                break;
              case 'Y':
                subtitle = 'Últimos 3 meses ';
                break;
              case 'T':
                //subtitle = 'Triada desde '+(this.f_actual.getFullYear()-3)+' hasta '+this.f_actual.getFullYear();
                subtitle = 'Último año';
                break;
            }

            //  Build Chart
            this.chartOptions = {
              chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                events: {
                  load: function () {
                    var theSeries = this.series;
                    for(let serie of theSeries){
                      if (serie.index > 0) {
                        serie.setVisible(false);
                      }
                    }
                  }
                }
              },
              title: {
                text: 'Equilibrio'
              },
              subtitle: {
                text: subtitle
              },
              tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
              },
              plotOptions: {
                pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  showInLegend: false
                }
              },
              credits: {
                 enabled: false
              },
              series: [{
                name: '% Total',
                colorByPoint: true,
                data: res
              }]
            }
          }
          else{
            let subtitle = "";
            switch(this.filter){
              case 'M':
                //subtitle = getMonthName(this.f_actual.getMonth())+ " "+this.f_actual.getFullYear();
                subtitle ='Últimos 28 días';
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
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                events: {
                  load: function () {
                    var theSeries = this.series;
                    for(let serie of theSeries){
                      if (serie.index > 0) {
                        serie.setVisible(false);
                      }
                    }
                  }
                }
              },
              title: {
                text: 'Equilibrio'
              },
              subtitle: {
                text: subtitle
              },
              tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
              },
              plotOptions: {
                pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  showInLegend: false
                }
              },
              credits: {
                 enabled: false
              },
              series: [{
                name: '% Total',
                colorByPoint: true,
                data: []
              }]
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
    this.userActivityCharPieList$ = this.database.list('user-activity')
      .map(_userActivities => 
        _userActivities.filter(userActivity => userActivity.uid == this.user.uid)) as FirebaseListObservable<UserActivity[]>;

    //  Build data for chart Line for Current Month
    this.userActivityCharPieList$.subscribe(
      userActivities => {
        if(userActivities.length > 0){
          userActivities.map(userActivity => {
            let d = new Date();
            let startDate = null;
            let endDate = null;
            if(this.filter == "M"){
              endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
              startDate = date_by_subtracting_days(endDate, 28);
              
            }
            else if(this.filter == "Y"){
              endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
              startDate = date_by_subtracting_days(endDate, 28*3);
        
            }
            else{
              
              endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
              startDate = date_by_subtracting_days(endDate, 28*13);
             
            }
            if(validate_fechaBetween(userActivity.d_fecha,dateFormat(startDate),dateFormat(endDate)) == 1){
              //  ['Descanso', 'Salud', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
              charData.push({
                "name" : 'Sueño',
                "y" : getHour(userActivity.d_suenho_descanso)
              });
              charData.push({
                "name" : 'Alimento',
                "y" : getHour(userActivity.d_alimento)
              });
              charData.push({
                "name" : 'Cuerpo',
                "y" : getHour(userActivity.d_yo_cuerpo)
              });
              charData.push({
                "name" : 'Mente',
                "y" : getHour(userActivity.d_yo_mente)
              });
              charData.push({
                "name" : 'Otros',
                "y" : getHour(userActivity.d_otros)
              });
              charData.push({
                "name" : 'Trabajo',
                "y" : getHour(userActivity.d_trabajo)
              });
              charData.push({
                "name" : 'Humanidad',
                "y" : getHour(userActivity.d_humanidad)
              });
              charData.push({
                "name" : 'Pareja',
                "y" : getHour(userActivity.d_pareja)
              });
            }
          })

          let res = alasql('SELECT name, sum(y) AS y \
          FROM ? \
          GROUP BY name \
          ORDER BY sum(y) ASC',[charData]);

          for(let i=0;i<res.length;i++){
              res[i].data = res[i].y;
              switch(res[i].name){
                case "Sueño":
                  res[i].color = '#442662';
                  break;
                case "Alimento":
                  res[i].color = '#0CB7F2';
                  break;
                case "Cuerpo":
                  res[i].color = '#009D71';
                  break;
                case "Mente":
                  res[i].color = '#009D71';
                  break;
                case "Otros":
                  res[i].color = '#FFD700';
                  break;
                case "Trabajo":
                  res[i].color = '#E87B31';
                  break;
                case "Humanidad":
                  res[i].color = '#C0C0C0';
                  break;
                case "Pareja":
                  res[i].color = '#CB1D11';
                  break;
              }
            }

          let subtitle = "";
          switch(this.filter){
            case 'M':
              //subtitle = getMonthName(this.f_actual.getMonth())+ " "+this.f_actual.getFullYear();
              subtitle ='Últimos 28 días';
              break;
            case 'Y':
              subtitle = 'Último 3 meses ';
              break;
            case 'T':
              subtitle = 'Último año';
              break;
          }

          //  Build Chart
          this.chartOptions = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie',
              events: {
                load: function () {
                  var theSeries = this.series;
                  for(let serie of theSeries){
                    if (serie.index > 0) {
                      serie.setVisible(false);
                    }
                  }
                }
              }
            },
            title: {
              text: 'Equilibrio'
            },
            subtitle: {
              text: subtitle
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                showInLegend: false
              }
            },
            credits: {
               enabled: false
            },
            series: [{
              name: '% Total',
              colorByPoint: true,
              data: res
            }]
          }
        }
        else{
          let subtitle = "";
          switch(this.filter){
            case 'M':
              //subtitle = getMonthName(this.f_actual.getMonth())+ " "+this.f_actual.getFullYear();
              subtitle ='Últimos 28 días';
              break;
            case 'Y':
              subtitle = 'Últimos 3 meses ';
              break;
            case 'T':
              subtitle = 'Último año';
              break;
          }
          //  Build Chart
          this.chartOptions = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie',
              events: {
                load: function () {
                  var theSeries = this.series;
                  for(let serie of theSeries){
                    if (serie.index > 0) {
                      serie.setVisible(false);
                    }
                  }
                }
              }
            },
            title: {
              text: 'Equilibrio'
            },
            subtitle: {
              text: subtitle
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                showInLegend: false
              }
            },
            credits: {
               enabled: false
            },
            series: [{
              name: '% Total',
              colorByPoint: true,
              data: []
            }]
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