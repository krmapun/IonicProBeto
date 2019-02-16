import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
/* Base de datos */
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthService } from '../providers/auth-service';

import { MyApp } from './app.component';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { SignInPage } from '../pages/signin/signin';
import { SignUpPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { AcercaPage } from "../pages/acerca/acerca";
import { AgregarPage } from '../pages/agregar/agregar';
import { WhatDoIWant2Page } from '../pages/que-quiero2/que-quiero2';
// Import chart pages
import { ChartLinePage } from '../pages/chart-line/chart-line';
import { ChartPiePage } from '../pages/chart-pie/chart-pie';
import { ChartBarPage } from '../pages/chart-bar/chart-bar';

import { TabsPage } from '../pages/tabs/tabs';
import { GuiaPage } from '../pages/guia/guia';

//  Import AddUserActivityPage and EditUserActivityPage
import { AddUserActivityPage } from '../pages/add-user-activity/add-user-activity';
import { EditUserActivityPage } from '../pages/edit-user-activity/edit-user-activity';

import { ChartModule } from 'angular2-highcharts';
import * as highcharts from 'highcharts';
//  Import FireBase Credentials
import { firebaseConfig } from './app.firebase.config';
//  Import OrderBy 
import {OrderBy} from "./orderby.pipe"


@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    HomePage,
    SignInPage,
    SignUpPage,
    ResetPasswordPage,
    AcercaPage,
    WhatDoIWant2Page,
    AgregarPage,
    TabsPage,
    ChartLinePage,
    ChartPiePage,
    ChartBarPage,
    GuiaPage,
    AddUserActivityPage,
    EditUserActivityPage,
    OrderBy
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ChartModule.forRoot(highcharts),    
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    HomePage,
    SignInPage,
    SignUpPage,
    ResetPasswordPage,
    AcercaPage,
    WhatDoIWant2Page,
    AgregarPage,
    TabsPage,
    ChartLinePage,
    ChartPiePage,
    ChartBarPage,
    GuiaPage,
    AddUserActivityPage,
    EditUserActivityPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    Facebook,
    TwitterConnect
  ]
})
export class AppModule {}
