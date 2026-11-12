import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsersAdminComponent } from './pages/users/users-admin.component';

const routes: Routes = [
  { path: '', component: UsersAdminComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ManageRoutingModule { }
