import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './shared/layouts/dashboard/dashboard.component';

import { AuthGuard } from './core/guards/auth.guard';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'admin',
    component: DashboardComponent,
    ...canActivate( () => redirectUnauthorizedTo(['/auth']) ),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then( m => m.HomeModule )
      },
      {
        path: 'publishers',
        loadChildren: () => import('./modules/publishers/publishers.module').then( m => m.PublishersModule )
      },
      {
        path: 'territories',
        loadChildren: () => import('./modules/territories/territories.module').then( m => m.TerritoriesModule )
      },
      {
        path: 'history',
        loadChildren: () => import('./modules/history/history.module').then( m => m.HistoryModule )
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  },
  {
    path: 'users',
    ...canActivate( () => redirectUnauthorizedTo(['/auth']) ),
    loadChildren: () => import('./modules/users/users.module').then( m => m.UsersModule )
  },
  {
    path: 'auth',
    loadChildren: () => import('./core/authentication/auth.module').then( m => m.AuthModule )
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


