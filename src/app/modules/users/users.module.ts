import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { AddComponent } from './pages/add/add.component';
import { UsersRoutingModule } from './users-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailComponent } from './pages/detail/detail.component';



@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UsersModule { }
