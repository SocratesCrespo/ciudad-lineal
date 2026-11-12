import { BackButtonComponent } from 'src/app/shared/components/back-button/back-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { RouterModule } from '@angular/router';
import { HistoryRoutingModule } from './history-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    BackButtonComponent,
    ReactiveFormsModule,
    RouterModule,
    HistoryRoutingModule
  ]
})
export class HistoryModule { }
