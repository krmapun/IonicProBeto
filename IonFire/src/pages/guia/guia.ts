import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-guia',
  templateUrl: 'guia.html',
})
export class GuiaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  slides = [
    {
      title: "ANDDANDO TE DA LA BIENVENIDA",
      description: "Descubre cómo organizar tu vida de manera equilibrada",
      image: "assets/images/Equilibrada.png",
      width: "200",
      height: "200",
    },
    {
      title: "¿QUÉ HACES TODOS LOS DÍAS ?",
      description: "Registra tus actividades diarias y la cantidad de tiempo que inviertes a cada una de ellas. Asegúrate de ingresar todo lo que hayas hecho, incluso aquello que para ti podría ocupar más de una categoría. Lo importante es que seas consciente de lo que haces y seas tú quien lo decida.",
      image: "assets/images/24-7.png",
      width: "100",
      height: "100",
    },
    {
      title: "",
      description: "Cada vez que finalices alguna actividad tómate un tiempo para anotar tus datos, también puedes hacerlo antes de dormir o de acuerdo a tus posibilidades. <br>¡Sólo te llevará 5 minutos!",
      image: "assets/images/Anddando200x200.jpg",
      width: "200",
      height: "200",
    },
    {
      title: "¿QUÉ QUIERO HACER?",
      description: "Dedícate un momento para pensar en lo que te gusta y crea una guía de lo que quisieras hacer diariamente. Incluye actividades que desearías iniciar o retomar para que sean parte de tu rutina diaria. <br>¡Recuerda! Sin importar lo que hagas, haz lo que más te guste pero hazlo. ",
      image: "assets/images/head.png",
      width: "118",
      height: "147",
    },
    {
      title: "¿CÓMO ESTOY ?",
      description: "Conoce de manera gráfica la forma en la que vives a partir de lo que haces durante las 24 horas del día. Cuáles son tus prioridades, qué desequilibrios puedes tener por la forma en la que ocupas el tiempo y cómo emplearlo de manera asertiva. <br> Una vez empieces a experimentar los beneficios del cambio que buscabas, disfruta y comparte tu proceso. ",
      image: "assets/images/head2.png",
      width: "126",
      height: "141",
    }
    /*{
      title: "EL ACTO ES LA VERDAD DE LA PALABRA",
      description: "¡ANDDANDO!",
      image: "assets/images/Celphone.png",
      width: "108",
      height: "109",
    }*/
  ];

  irHome() {
    this.navCtrl.setRoot(HomePage);
  }

}
