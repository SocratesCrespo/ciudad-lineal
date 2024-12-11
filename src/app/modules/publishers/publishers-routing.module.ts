import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { AddPublisherComponent } from './components/add-publisher/add-publisher.component';
import { EditPublisherComponent } from './components/edit-publisher/edit-publisher.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ListComponent },
      { path: 'detail/:id', component: DetailComponent },
      { path: 'edit/:id', component:EditPublisherComponent },
      { path: 'add', component:AddPublisherComponent },
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
export class PublishersRoutingModule { }
