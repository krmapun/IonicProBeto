import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-guia',
  templateUrl: './guia.page.html',
  styleUrls: ['./guia.page.scss'],
})
export class GuiaPage implements OnInit {

  constructor(public authservice : AuthService) { }

  slides = [
    {
      title: 'CRONEX TE DA LA BIENVENIDA',
      description: 'Descubre cómo organizar y cotizar tu trabajo como Desarrollador',
      image: '../../assets/images/logo_chronex.png',
    },
    {
      title: 'PRIMERO DEBES CARGAR TUS TAREAS',
// tslint:disable-next-line: max-line-length
      description: 'Registra tus actividades o tareas desde la opcion del menu "Ingresa tus tareas". ',
      image: '../../assets/images/jobs.png',
    },
    {
      title: 'SEGUNDO DEBES CALCULAR TU VALOR HORA',
// tslint:disable-next-line: max-line-length
      description: 'Ingresa a la opción "Calcular" donde puedes estimar el valor de tu salario en hora.',
      image: '../../assets/images/calc.png',
    },
    {
      title: '¡POR ULTIMO!',
// tslint:disable-next-line: max-line-length
      description: 'Ingresa a la opción "Resumen" donde podras observar el calculo del costo del proyecto, el total de horas y actividades, para que gestiones tu proyecto.',
      image: '../../assets/images/docs.png',
    }
  ];
  
  ngOnInit() {
  }

  signOut(){
    this.authservice.logout();
  }

}
