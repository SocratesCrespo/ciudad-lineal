import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';
import { AuthModule } from './core/authentication/auth.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { enviroment } from 'src/enviroments/enviroment.prod';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { GuardService } from './core/guards/guards.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    NgbModule,
    SharedModule,
    AuthModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp (enviroment.firebase) ),
    provideFirestore( () => getFirestore() ),
    provideAuth(() => getAuth())
  ],
  providers: [GuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
