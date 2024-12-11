import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/authentication/services/auth.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.sass']
})
export class MainMenuComponent implements OnInit {
  public currentUser: string = '';

  constructor( 
    private auth: AuthService,
    private router: Router
   ){}

   ngOnInit() {
    const user = localStorage.getItem( 'name' );
    if( user ){
      this.currentUser = user;
    }
  }

  logOut(){
    this.auth.logout()
      .then( () => this.router.navigate(['auth']) );
  }

}
