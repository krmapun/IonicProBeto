import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditUserActivityPage } from './edit-user-activity';

@NgModule({
  declarations: [
    EditUserActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(EditUserActivityPage),
  ],
})
export class EditUserActivityPageModule {}
