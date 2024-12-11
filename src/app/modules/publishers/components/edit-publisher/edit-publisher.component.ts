import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Publisher } from '../../models/publisher.interface';
import { PublishersService } from '../../services/publishers.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-publisher',
  templateUrl: './edit-publisher.component.html',
  styleUrls: ['./edit-publisher.component.sass']
})
export class EditPublisherComponent implements OnInit, OnDestroy {

  public publisher!: Publisher;
  public editForm: FormGroup = this.fb.group({
    firstname: ['', [ Validators.required, Validators.minLength(3) ]],
    lastname: ['', [ Validators.required, Validators.minLength(3) ]],
    publisherType: ['', [ Validators.required ]],
    email: ['', [ Validators.required ]],
    phone: ['', [ Validators.required ]],
    whatsapp: ['', [ Validators.required ]],
    address: ['', [ Validators.required ]],
    description: ['']
  });
  success: boolean = false;
  destroyObs$: Subject<void> = new Subject();

  constructor( private fb: FormBuilder,
               private activatedRoute: ActivatedRoute,
               private publishersService: PublishersService ){}

  async ngOnInit() {
    this.activatedRoute.params
      .pipe( takeUntil( this.destroyObs$ ) )
      .subscribe(
      async  ({ id }) => {
          const publisherData = await this.publishersService.getPublisherById( id );
          this.publisher = await { id, ...publisherData };
          this.fillForm();
        }
      );
  }

  ngOnDestroy(): void {
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }

  edit(){
    const editedPublisher: Publisher = {
      id: this.publisher.id ? this.publisher.id : '',
      firstname: this.editForm.value.firstname,
      lastname: this.editForm.value.lastname,
      publisherType: this.editForm.value.publisherType,
      history: [],
      email: this.editForm.value.email,
      phone: this.editForm.value.phone,
      whatsapp: this.editForm.value.whatsapp,
      address: this.editForm.value.address,
      description: this.editForm.value.description,
      territories: []
    }

    this.publishersService.editPublisher( editedPublisher );
    this.success = true;
  }

  fillForm(){
    this.editForm.patchValue({
      firstname: this.publisher.firstname,
      lastname: this.publisher.lastname,
      publisherType: this.publisher.publisherType,
      email: this.publisher.email,
      phone: this.publisher.phone,
      whatsapp: this.publisher.whatsapp,
      address: this.publisher.address,
      description: this.publisher.description
    });
  }

}
