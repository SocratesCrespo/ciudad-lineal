import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './pages/detail/detail.component';
import { AddTerritoryComponent } from './components/add-territory/add-territory.component';
import { AssignTerritoryComponent } from './components/assign-territory/assign-territory.component';
import { EditTerritoryComponent } from './components/edit-territory/edit-territory.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component:ListComponent },
      { path: 'detail/:id', component:DetailComponent },
      { path: 'add', component:AddTerritoryComponent },
      { path: 'edit/:id', component:EditTerritoryComponent },
      { path: 'assign/:id', component:AssignTerritoryComponent },
      { path: '**', redirectTo: '/' }
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TerritoriesRoutingModule { }
