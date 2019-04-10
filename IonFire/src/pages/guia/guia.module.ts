import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuiaPage } from './guia';

@NgModule({
  declarations: [
    GuiaPage,
  ],
  imports: [
    IonicPageModule.forChild(GuiaPage),
  ],
})
export class GuiaPageModule {}
