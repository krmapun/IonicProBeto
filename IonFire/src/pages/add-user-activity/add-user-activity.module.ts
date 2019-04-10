import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddUserActivityPage } from './add-user-activity';

@NgModule({
  declarations: [
    AddUserActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(AddUserActivityPage),
  ],
})
export class AddUserActivityPageModule {}
