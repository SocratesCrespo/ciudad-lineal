import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/authentication/services/auth.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent {

  public addForm: FormGroup = this.fb.group({
    name: ['', [ Validators.required ]],
    email: ['', [ Validators.required ]],
    password: ['', [ Validators.required ]]
  });

  public error: string = '';
  public success: boolean = false;

  constructor( private fb: FormBuilder,
               private auth: AuthService ){}

  addUser(){

    if( this.addForm.invalid ) {
      this.error = 'Los campos no son correctos';
      return;
    }

    if( this.addForm.value.password.length < 6 ){
      this.error = 'La contraseña debe tener mínimo 6 caracteres';
      return;
    }

    this.error = '';
    this.auth.register( this.addForm.value.email, this.addForm.value.password, this.addForm.value.name )
    .then( response => {
      this.error = '';
      this.success = true;
      this.addForm.reset();
    })
    .catch( error => console.log(error) );

  }

  anotherUser(){
    this.success = false;
    this.error = '';
    this.addForm.patchValue({
      name: '',
      email: '',
      password: ''
    });
  }

}
