import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Calcula',
      url: '/calculador',
      icon: 'add-circle'
    },
    {
      title: 'Ingresa Tus tareas',
      url: '/task',
      icon: 'ios-book'
    },
    {
      title: 'Resumen',
      url: '',
      icon: 'filing'
    },
    {
      title: 'Guia Rapida',
      url: '/guia',
      icon: 'help'
    },
    {
      title: 'Acerca de Cronex',
      url: '/acercade',
      icon: 'information-circle'
    }

  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
