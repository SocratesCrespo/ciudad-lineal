import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TerritoriesService } from '../../services/territories.service';
import { Territory } from '../../models/territories.interface';
import { PublishersService } from 'src/app/modules/publishers/services/publishers.service';
import { Publisher } from 'src/app/modules/publishers/models/publisher.interface';
import { Subject, Subscription, takeUntil } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-add-territory',
  templateUrl: './add-territory.component.html',
  styleUrls: ['./add-territory.component.sass'],
  providers: [ 
  ]
})
export class AddTerritoryComponent {

  public addForm: FormGroup = this.fb.group({
    territoryNumber: [0, [ Validators.required, Validators.min(1) ]],
    description: [''],
    territoryMap: ['', [ Validators.required, Validators.minLength(11) ]],
    territoryType: ['', [ Validators.required ]]
  });

  public added: boolean = false;
  public error: boolean = false;
  public publishers: Publisher[] = [];
  public destroyObs$: Subject<void> = new Subject();

  constructor( private fb: FormBuilder,
               private TerritoriesService: TerritoriesService,
               private publishersService: PublishersService ){}

  async onSave(){
    if( this.addForm.invalid ){
      this.error = true;
      return;
    }

    const newTerritory: Territory = {
      number :  this.addForm.value.territoryNumber,
      description : this.addForm.value.description !== '' ? this.addForm.value.description.trim() : '',
      history: [],
      type : this.addForm.value.territoryType.trim(),
      map : this.addForm.value.territoryMap.trim(),
      publisher : '',
      state : 'Not assigned',
      date_assigned: '',
      last_date: Number(moment().subtract(120, 'days').format('YYYYMMDD'))
    };

    const response = await this.TerritoriesService.addTerritory( newTerritory );
    this.error = false;
    this.added = true;
    this.addForm.reset();
  }

  addedNew(){
    this.added = false;
    this.addForm.patchValue({
      territoryNumber: 0,
      description: '',
      territoryMap: '',
      territoryType: ''
    })
  }

}
