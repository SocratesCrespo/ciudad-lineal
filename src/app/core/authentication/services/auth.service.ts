import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { UsersService } from 'src/app/modules/users/services/users.service';
import { UserCustomer } from 'src/app/modules/users/models/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token?: string;

  constructor( private http: HttpClient,
               private auth: Auth,
               private usersService: UsersService,
               private router: Router
              ) { }

  async login( email: string, password: string ){
    try {
      const response = await signInWithEmailAndPassword(this.auth, email, password);
      localStorage.setItem('id', response.user.uid);
      localStorage.setItem('email', response.user.email ? response.user.email : '');
      localStorage.setItem('name', response.user.displayName ? response.user.displayName : '');
      localStorage.setItem('token', response.user.refreshToken ? response.user.refreshToken : '');
      this.token = response.user.uid;
  
      if (response.user.uid) {
        const userData = await this.usersService.getUserById(response.user.uid);
        if( userData ){
          localStorage.setItem( 'role', userData.role );
          localStorage.setItem( 'id_publisher', userData.id_publisher );
        }else{
          localStorage.setItem( 'role', 'No Role' );
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
      
  }

  async logout(){
    return signOut( this.auth )
      .then(
        () => localStorage.clear()
      )
  }

  async register( email: string, password: string, name: string ){
    return await createUserWithEmailAndPassword( this.auth, email, password )
      .then(
        async response => {
          updateProfile( response.user, {
            displayName: name
          });
          const user: UserCustomer = {
            id_customer : response.user.uid,
            name : name,
            email : email,
            id_publisher : '',
            role : 'admin'
          }
          await this.usersService.addUser( user );
        }
      );
  }

  redirectLogin( role: string, id_publisher: string ){
    if( role === 'admin' ) this.router.navigate(['/admin']);
    if( role === 'customer' ) this.router.navigate(['/users/detail/' + id_publisher]);
    if( role !== 'admin' && role !== 'customer' ){
      localStorage.clear();
      this.router.navigate(['/users']);
    } 
  }

  /* checkAuthentication(): Observable<boolean> {
    const id = localStorage.getItem('id');

    if ( ! id  ) return of(false);
    return of( true );
  } */
  
}
