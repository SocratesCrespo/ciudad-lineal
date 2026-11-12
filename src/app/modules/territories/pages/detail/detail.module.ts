import { BackButtonComponent } from 'src/app/shared/components/back-button/back-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DetailComponent } from './detail.component';
import { FinishTerritoryComponent } from './components/finish-territory/finish-territory.component';
import { DeleteTerritoryComponent } from './components/delete-territory/delete-territory.component';



@NgModule({
  declarations: [
    DetailComponent,
    FinishTerritoryComponent,
    DeleteTerritoryComponent
  ],
  imports: [
    CommonModule,
    BackButtonComponent,
    RouterModule
  ]
})
export class DetailModule { }
