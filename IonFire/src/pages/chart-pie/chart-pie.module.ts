import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartPiePage } from './chart-pie';

@NgModule({
  declarations: [
    ChartPiePage,
  ],
  imports: [
    IonicPageModule.forChild(ChartPiePage),
  ],
})
export class ChartPiePageModule {}
