import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListModule } from './pages/list/list.module';
import { PublishersRoutingModule } from './publishers-routing.module';
import { AddPublisherComponent } from './components/add-publisher/add-publisher.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailModule } from './pages/detail/detail.module';
import { EditPublisherComponent } from './components/edit-publisher/edit-publisher.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AddPublisherComponent,
    EditPublisherComponent
  ],
  imports: [
    CommonModule,
    DetailModule,
    ListModule,
    PublishersRoutingModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class PublishersModule { }
