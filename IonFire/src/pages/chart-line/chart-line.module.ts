import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartLinePage } from './chart-line';

@NgModule({
  declarations: [
    ChartLinePage,
  ],
  imports: [
    IonicPageModule.forChild(ChartLinePage),
  ],
})
export class ChartLinePageModule {}
