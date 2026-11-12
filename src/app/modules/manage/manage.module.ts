import { BackButtonComponent } from 'src/app/shared/components/back-button/back-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageRoutingModule } from './manage-routing.module';
import { UsersAdminComponent } from './pages/users/users-admin.component';

@NgModule({
  declarations: [
    UsersAdminComponent
  ],
  imports: [
    CommonModule,
    BackButtonComponent,
    ManageRoutingModule
  ]
})
export class ManageModule { }
