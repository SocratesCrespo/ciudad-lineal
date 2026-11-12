import { BackButtonComponent } from 'src/app/shared/components/back-button/back-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    BackButtonComponent,
    RouterModule
  ]
})
export class ListModule { }
