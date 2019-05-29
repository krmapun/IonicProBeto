import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { TaskI2 } from '../../models/calcular.interface';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { CalculadorService } from '../../servicios/calculador.service';
import { isNull } from 'util';

@Component({
  selector: 'app-calculador',
  templateUrl: './calculador.page.html',
  styleUrls: ['./calculador.page.scss'],
})

export class CalculadorPage implements OnInit {

  calc: TaskI2 = {
    fecha: null,
    usuario: '',
    salario: null,
    pc: null,
    alquiler: null,
    telinter: null,
    transporte: null,
    alimentacion: null,
    software: null,
    salud: null,
    impuestos: null,
    educacion: null,
    personales: null,
    otros: null,
    salarioxhora: null,
    cesantias: null,
    prima: null,
    vacaciones: null,

  };
  calcularId = null;

  constructor(public authservice: AuthService,
              private route: ActivatedRoute,
              private nav: NavController,
              private loadingcontroller: LoadingController,
              private calculadorService: CalculadorService , ) { }

  ngOnInit() {
    this.calc.usuario = window.localStorage.getItem('idusu');
    this.calc.fecha = new Date();
    this.calculadorService.getTodos().subscribe((calc) => {
      console.log ('data calc ' + JSON.stringify(calc));
    });
  }

  async loadTodo() {
    const loading = await this.loadingcontroller.create({
      message: 'Cargando.....'
      });
    await loading.present();
    this.calculadorService.getTodo(this.calcularId).subscribe( res =>{
      loading.dismiss();
      this.calc = res;
    });
  }

  signOut() {
    this.authservice.logout();
  }
  async logForm() {
    let suma = 0;
    let mespc = 0;
    let horastrabajadasmes = 0;
    let horastrabajadassemana = 0;


    if (this.calc.pc === 0) {
      mespc = this.calc.pc;
    } else {
      mespc = (this.calc.pc / 12);
    }

    suma = (this.calc.salario +
      this.calc.alquiler +
      this.calc.telinter +
      this.calc.transporte +
      this.calc.alimentacion +
      this.calc.software +
      this.calc.salud +
      this.calc.impuestos +
      this.calc.educacion +
      this.calc.personales +
      this.calc.otros +
      mespc);

    horastrabajadassemana = 36;
    horastrabajadasmes = horastrabajadassemana * 4.34524;

    // quitandole el 30% de horas no facturables
    horastrabajadasmes =  horastrabajadasmes - (horastrabajadasmes * 0.30) ;

    // calculo prima Prima de servicios: (Salario mensual * Días trabajados en el semestre)/360.

    this.calc.prima = (suma * 30.4) / 360;
    // calculo cesantias Cesantías: (Salario mensual * Días trabajados)/360. Intereses sobre cesantías: (Cesantías * Días trabajados * 0,12)/360.

    this.calc.cesantias = ((suma * 30.4) / 360);
    this.calc.cesantias = this.calc.cesantias + ((this.calc.cesantias * 30.4 * 0.12) / 360);

    // Vacaciones: (Salario mensual básico * Días trabajados)/720
    this.calc.vacaciones = (suma * 30.4) / 720;
    
    this.calc.salarioxhora = (suma + this.calc.prima + this.calc.cesantias + this.calc.vacaciones) / horastrabajadasmes;

    const loading = await this.loadingcontroller.create({
      message: 'Calculando.....'
      });
    await loading.present();
    if(this.calcularId){
      //Update
      this.calculadorService.updateTodo(this.calc, this.calcularId).then(() => {
        loading.dismiss();
        this.nav.navigateForward('/home');
      });
    }
    else{
      //addnew
      this.calculadorService.addTodo(this.calc).then(() => {
        loading.dismiss();
        alert('el valor aproximado de su hora como desarrollador es'+ this.calc.salarioxhora + '$ pesos')
        this.nav.navigateForward('/home');
      });
    }
  }
}
