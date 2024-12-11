import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Publisher } from 'src/app/modules/publishers/models/publisher.interface';
import { PublishersService } from 'src/app/modules/publishers/services/publishers.service';
import { UsersService } from 'src/app/modules/users/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public registerForm: FormGroup = this.fb.group({
    publisher: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required]], 
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });
  public mainError: string = '';
  public publishers: Publisher[] = [];
  public destroyObs$: Subject<void> = new Subject();
  public success: boolean = false;
  public inputPassword: boolean = false;
  public inputPasswordConfirm: boolean = false;

  constructor( 
    private fb: FormBuilder,
    private router: Router,
    private usersServices: UsersService,
    private publishersService: PublishersService
  ){}

  ngOnInit(): void {
      this.publishersService.getPublishers()
       .pipe( takeUntil( this.destroyObs$ ) )
       .subscribe(
         publishers => this.publishers = publishers.sort((a,b) => a.firstname.localeCompare(b.firstname))
       );
  }

  ngOnDestroy(): void {
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }
  
  // Register new user
  async register(){

    if( this.registerForm.invalid ){
      this.mainError = 'Hay errores en los campos';
      return;
    }

    if( this.registerForm.value.password !== this.registerForm.value.confirmPassword ){
      this.mainError = 'Hay errores en los campos';
      return;
    }

    // Creating constants
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.confirmPassword;
    const publisher_id = this.registerForm.value.publisher;
    const name = this.publisherNameById( publisher_id );

    // Register if evrything is ok
    const success = await this.usersServices.registerCustomer( email, password, name, publisher_id, 'customer' )
      .then( response => {
        this.mainError = '';
        this.success = true;
        this.registerForm.reset();
      })
      .catch( error => {
         if( error.message.includes('email-already-in-use') ){ 
          this.mainError = 'El correo ya está registrado';
        } else {
          this.mainError = error.message;
        }
      });

  }

  // Get publisher name from publishers
  publisherNameById( id: string ): string{
    const publisherFiltered = this.publishers.filter( publisher => publisher.id === id );

    if( publisherFiltered.length == 0 ){
      return '';
    }
    
    return publisherFiltered[0].firstname + ' ' + publisherFiltered[0].lastname;
  }

  hidePassword(): void {
    this.inputPassword = false;
  }
  
  showPassword(): void {
    this.inputPassword = true;
  }

  hidePasswordConfirm(): void {
    this.inputPasswordConfirm = false;
  }
  
  showPasswordConfirm(): void {
    this.inputPasswordConfirm = true;
  }

}
