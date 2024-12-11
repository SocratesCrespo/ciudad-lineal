import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './pages/main/main.component';
import { HomeRoutingModule } from './home-routing.module';
import { MainInfoComponent } from './pages/main/components/main-info/main-info.component';
import { RouterModule } from '@angular/router';
import { HistoryInfoComponent } from './pages/main/components/history-info/history-info.component';
import { ToExpireComponent } from './pages/main/components/to-expire/to-expire.component';



@NgModule({
  declarations: [
    MainComponent,
    MainInfoComponent,
    HistoryInfoComponent,
    ToExpireComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule
  ]
})
export class HomeModule { }
