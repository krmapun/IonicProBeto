import { Component } from '@angular/core';
import { IonicPage,NavController } from 'ionic-angular';
//	Import chart pages
import { ChartLinePage } from '../chart-line/chart-line';
import { ChartPiePage } from '../chart-pie/chart-pie';
import { ChartBarPage } from '../chart-bar/chart-bar';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  ChartLineRoot = ChartLinePage;
  ChartPieRoot = ChartPiePage;
  ChartBarRoot = ChartBarPage;

  constructor(public navCtrl: NavController) {}

}
