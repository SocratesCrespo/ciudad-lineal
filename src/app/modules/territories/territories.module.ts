import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListModule } from './pages/list/list.module';
import { TerritoriesRoutingModule } from './territories-routing.module';
import { AddTerritoryComponent } from './components/add-territory/add-territory.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FirestoreModule } from '@angular/fire/firestore';
import { AssignTerritoryComponent } from './components/assign-territory/assign-territory.component';
import { DetailModule } from './pages/detail/detail.module';
import { RouterModule } from '@angular/router';
import { EditTerritoryComponent } from './components/edit-territory/edit-territory.component';



@NgModule({
  declarations: [
    AddTerritoryComponent,
    AssignTerritoryComponent,
    EditTerritoryComponent
  ],
  imports: [
    CommonModule,
    DetailModule,
    ListModule,
    TerritoriesRoutingModule,
    ReactiveFormsModule,
    FirestoreModule,
    RouterModule
  ]
})
export class TerritoriesModule { }
