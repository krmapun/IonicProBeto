import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartBarPage } from './chart-bar';

@NgModule({
  declarations: [
    ChartBarPage,
  ],
  imports: [
    IonicPageModule.forChild(ChartBarPage),
  ],
})
export class ChartBarPageModule {}
