import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserCustomer, UserRole } from 'src/app/modules/users/models/user.interface';
import { UsersService } from 'src/app/modules/users/services/users.service';

@Component({
  selector: 'app-users-admin',
  templateUrl: './users-admin.component.html',
  styleUrls: ['./users-admin.component.sass']
})
export class UsersAdminComponent implements OnInit, OnDestroy {

  public users: UserCustomer[] = [];
  public loading: boolean = true;
  public error: string = '';
  public success: string = '';
  private successTimer?: ReturnType<typeof setTimeout>;
  public currentUserId: string = localStorage.getItem('id') ?? '';

  public roles: { value: UserRole, label: string }[] = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'customer', label: 'Cliente' },
    { value: 'admin', label: 'Administrador' }
  ];

  // Confirmaciones
  public userToDelete?: UserCustomer;
  public userToReset?: UserCustomer;

  private destroyObs$: Subject<void> = new Subject();

  constructor( private usersService: UsersService ){}

  ngOnInit(): void {
    this.usersService.getUsers()
      .pipe( takeUntil( this.destroyObs$ ) )
      .subscribe({
        next: users => {
          // Primero los pendientes, luego por nombre
          this.users = users.sort( (a, b) => {
            const pa = a.role === 'pending' ? 0 : 1;
            const pb = b.role === 'pending' ? 0 : 1;
            return pa - pb || (a.name ?? '').localeCompare( b.name ?? '' );
          });
          this.loading = false;
        },
        error: err => {
          console.error( err );
          this.error = 'No se pudo cargar la lista de usuarios';
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    clearTimeout( this.successTimer );
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }

  isCurrentUser( user: UserCustomer ): boolean {
    return user.id_customer === this.currentUserId;
  }

  roleLabel( role: string ): string {
    return this.roles.find( r => r.value === role )?.label ?? role;
  }

  async changeRole( user: UserCustomer, role: UserRole ){
    if( !user.id_customer || user.role === role ) return;
    this.error = '';
    try{
      await this.usersService.updateRole( user.id_customer, role );
      this.showSuccess( `Se ha modificado con éxito el rol de ${ user.name } a ${ this.roleLabel( role ) }` );
    }catch(err){
      console.error( err );
      this.error = 'No se pudo cambiar el rol';
    }
  }

  private showSuccess( message: string ){
    this.success = message;
    clearTimeout( this.successTimer );
    this.successTimer = setTimeout( () => this.success = '', 5000 );
  }

  askReset( user: UserCustomer ){
    this.userToReset = user;
  }

  cancelReset(){
    this.userToReset = undefined;
  }

  async confirmReset(){
    const user = this.userToReset;
    this.userToReset = undefined;
    if( !user?.email ) return;
    this.error = '';
    try{
      await this.usersService.sendPasswordReset( user.email );
      this.showSuccess( `Se ha enviado a ${ user.email } un correo para restablecer su contraseña` );
    }catch(err){
      console.error( err );
      this.error = 'No se pudo enviar el correo de restablecimiento';
    }
  }

  approve( user: UserCustomer ){
    return this.changeRole( user, 'customer' );
  }

  askDelete( user: UserCustomer ){
    this.userToDelete = user;
  }

  cancelDelete(){
    this.userToDelete = undefined;
  }

  async confirmDelete(){
    const uid = this.userToDelete?.id_customer;
    if( !uid ) return;
    this.error = '';
    try{
      await this.usersService.deleteUser( uid );
    }catch(err){
      console.error( err );
      this.error = 'No se pudo eliminar el usuario';
    }
    this.userToDelete = undefined;
  }

}
