import { Component, OnDestroy, OnInit } from '@angular/core';
import { PublishersService } from '../../services/publishers.service';
import { Publisher } from '../../models/publisher.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { image } from 'src/assets/vars/globals';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Territory } from 'src/app/modules/territories/models/territories.interface';
import { TerritoriesService } from 'src/app/modules/territories/services/territories.service';
import { DatesService } from 'src/app/core/services/dates.service';
import { Subject, filter, firstValueFrom, forkJoin, from, mergeMap, of, takeUntil } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit, OnDestroy {
  
  public finishModalClass: string = 'd-none';
  public deleteModalClass: string = 'd-none';
  public imgSlug: string = image.slug;
  public showForm: boolean = false;
  public showList: boolean = false;
  public currentTerritory!: Territory;
  public territories!: Territory[];
  public territoriesToAssign!: Territory[];
  public territorySelected!: Territory;
  public error: boolean = false;
  public success: boolean = false;
  public destroyObs$: Subject<void> = new Subject();
  public assignForm: FormGroup = this.fb.group({
    territory: ['', [Validators.required, Validators.min(1)]],
    description: ['']
  });
  public publisher: Publisher = {
    id: '',
    firstname: '',
    lastname: '',
    publisherType: '',
    email: '',
    phone: '',
    whatsapp: '',
    description: '',
    address: '',
    territories: [],
    history: []
  };
  

  constructor( private publishersService: PublishersService,
               private activatedRoute: ActivatedRoute,
               private territoriesService: TerritoriesService,
               private fb: FormBuilder,
               private datesService: DatesService,
               private router: Router ){}
  
   ngOnInit() {
     this.getTerritories();
     //this.getCurrentPublisherData();
     this.getPublisherSub();
  }

  ngOnDestroy() {
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }

  getPublisherSub(){
    this.activatedRoute.params.pipe( 
      filter( res => !!res ),
      mergeMap( ({ id }) => {
        return forkJoin({
          id: of( id ),
          publisher: from( this.publishersService.getPublisherById( id ) ) 
        })
      }),
      takeUntil( this.destroyObs$ )
    ).subscribe( ({ id, publisher }) => {
      this.publisher = { id, ...publisher }
      this.assignForm.enable();
      this.assignForm.reset();
      this.showForm = false;
      this.success = false;
    })
  }

  async getCurrentPublisherData(){
    try {
      const { id } = await firstValueFrom( this.activatedRoute.params.pipe( filter( res => !!res ) ) )
      const getPublisher = await this.publishersService.getPublisherById( id );
      this.publisher = { id, ...getPublisher };
    } catch (error) {
      console.log(error)
    }
  }

  async assignTerritory(){
    const territory = this.territorySelected;
    const publisher = this.publisher;
    const description = this.assignForm.value.description;
    const currentDate = moment().format('DD-MM-YYYY');

    if( this.assignForm.disabled || this.assignForm.invalid ){
      return;
    }

    if( !this.territorySelected || this.assignForm.value.territory === 0 || this.assignForm.value.territory === '' ){
      this.error = true;
      return;
    }
    
    await this.territoriesService.assignTerritory( territory, publisher, description, currentDate );
    this.assignForm.disable();
    this.success = true;
  }

  getTerritories(){
    this.territoriesService.getTerritories()
      .pipe( takeUntil( this.destroyObs$ ) )
      .subscribe(
        territories => { this.territories = territories }
      );
  }

  selectTerritory( territory: Territory ){
    this.assignForm.patchValue({
      territory : territory.number
    });
    this.territorySelected = territory;
    this.showList = false;
  }

  displayList(){
    const territoryNumber = this.assignForm.value.territory;

    if( territoryNumber == 0 || territoryNumber == '' ){
      return;
    }

    if( territoryNumber > 0 ){
      this.territoriesToAssign = this.territories.filter(
        territory => territory.number.toString().includes( territoryNumber ) && territory.state === 'Not assigned'
      );
      this.showList = true;
    }

    if( territoryNumber == 0 || !territoryNumber ){
      this.showList = false;
    }
  }

  finishThisTerritory( number: number ){
    const territory = this.territories.find( territory => territory.number === number );
    if ( territory ){
      this.currentTerritory = territory;
    }

    this.finishModalClass = 'd-block';

  }

  hideDeleteModal( value: string ){
    this.deleteModalClass = value;
  }

  hideModal( value: string ){
    this.finishModalClass = value;
  }

  displayForm(){
    this.showForm = true;
  }

  hideForm(){
    this.assignForm.reset();
    this.showList = false;
    this.showForm = false;
  }

}
