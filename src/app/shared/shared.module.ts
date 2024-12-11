import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { ManageModule } from '../modules/manage/manage.module';
import { SearchMenuComponent } from './layouts/dashboard/components/search-menu/search-menu.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MainMenuComponent } from './layouts/public/main-menu/main-menu.component';




@NgModule({
  declarations: [
    SearchMenuComponent,
    DashboardComponent,
    MainMenuComponent
  ],
  imports: [
    CommonModule,
    ManageModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    DashboardComponent,
    MainMenuComponent
  ]
})
export class SharedModule { }
