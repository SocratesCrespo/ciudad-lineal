import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublishersService } from '../../services/publishers.service';
import { Publisher } from '../../models/publisher.interface';

@Component({
  selector: 'app-add-publisher',
  templateUrl: './add-publisher.component.html',
  styleUrls: ['./add-publisher.component.sass']
})
export class AddPublisherComponent {

  public addForm: FormGroup = this.fb.group({
    firstname: ['', [ Validators.required, Validators.minLength(3) ]],
    lastname: ['', [ Validators.required, Validators.minLength(3) ]],
    publisherType: ['', [ Validators.required ]],
    email: ['', [ Validators.required ]],
    phone: ['', [ Validators.required ]],
    whatsapp: ['', [ Validators.required ]],
    address: ['', [ Validators.required ]],
    description: ['']
  });

  public added: boolean = false;
  public error: boolean = false;

  constructor( private fb: FormBuilder,
               private publisherService: PublishersService){}

  async onSave(){
    if( this.addForm.invalid ){
      this.error = true;
      return;
    }

    const newPublisher: Publisher = {
      firstname :  this.addForm.value.firstname.trim(),
      lastname :  this.addForm.value.lastname.trim(),
      email :  this.addForm.value.email.trim(),
      publisherType : this.addForm.value.publisherType.trim(),
      history: [],
      description :  this.addForm.value.description.trim(),
      phone : this.addForm.value.phone.trim(),
      whatsapp : this.addForm.value.whatsapp.trim(),
      address: this.addForm.value.address.trim(),
      territories: []
    };

    if( newPublisher ){
      const response = await this.publisherService.addPublisher( newPublisher );
      this.error = false;
      this.added = true;
      this.addForm.reset();
    }

  }

}
