import { Component, OnDestroy, OnInit } from '@angular/core';
import { Territory } from '../../models/territories.interface';
import { TerritoriesService } from '../../services/territories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Publisher } from 'src/app/modules/publishers/models/publisher.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublishersService } from 'src/app/modules/publishers/services/publishers.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DatesService } from 'src/app/core/services/dates.service';
import * as moment from 'moment';

@Component({
  selector: 'app-assign-territory',
  templateUrl: './assign-territory.component.html',
  styleUrls: ['./assign-territory.component.sass']
})
export class AssignTerritoryComponent implements OnInit, OnDestroy {

  public territory!: Territory;
  public publisherList!: Publisher[];
  public resultPublishers!: Publisher[];
  public publisherSelected!: Publisher;
  public list: boolean = false;
  public destroyObs$: Subject<void> = new Subject();
  public error: boolean = false;
  public success: boolean = false;

  public assignForm: FormGroup = this.fb.group({
    publisher: ['', [ Validators.required, Validators.minLength(1) ]],
    description: ['']
  });
  
  formattedDate!: string;

  constructor( 
    private territoriesService: TerritoriesService,
    private publishersService: PublishersService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datesService: DatesService,
    private router: Router
    ){}

  async ngOnInit() {
  // Getting current territory data
   this.activatedRoute.params
    .pipe( takeUntil( this.destroyObs$ ) )
    .subscribe(
      async ({ id }) => {
        const territoryData = await this.territoriesService.getTerritoryById( id );
        this.territory = territoryData;
        this.territory.id = id;
        if( this.territory.state == 'Assigned' ){
          this.assignForm.disable();
        }
      }
    );

    // Getting publisher list to show in search input
    this.publishersService.getPublishers()
        .pipe( takeUntil( this.destroyObs$ ) )
        .subscribe(
          publishers => {
            // Assigning and sorting publisher list
            this.publisherList = publishers.sort((a, b) => {
              if( a.firstname < b.firstname ){ return -1; }
              if( a.firstname > b.firstname ){ return 1; }
              if (a.lastname < b.lastname) { return -1; }
              if (a.lastname > b.lastname) { return 1; }
              return 0;
            });
          }
        );
  }



  // Destroying observable
  ngOnDestroy(): void {
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }

  currentDate(){
    this.formattedDate = this.datesService.getCurrentDate();
  }

  // Search publishers while name is writing
  showList(){
    const search = this.assignForm.value.publisher;

    if( search.length <= 2 ){
      this.list = false;
    }

    // If input has 3 characters, display result of search
    if( search.length > 2 ){
      this.resultPublishers = this.publisherList.filter(
        publisher => {
          // Showing publisher list, only if the publisher has not territory assigned
          const resultList = this.normalizeString(publisher.firstname).toLowerCase().includes( this.normalizeString(search).toLowerCase() );
          const hasNotTerritories = publisher.territories.length == 0;
          const isAvailable = publisher.publisherType === 'regular' || publisher.publisherType === 'auxiliar';
          this.list = true;

          return (resultList && hasNotTerritories) || (resultList && isAvailable);
        }
      );

    }
  }

  selectPublisher( publisher: Publisher ){
    this.assignForm.get('publisher')?.setValue( publisher.firstname + ' ' + publisher.lastname );
    this.list = false;
    this.publisherSelected = publisher;
  }

  // This function transforms the string for better comparison
  normalizeString(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Assigning territory to publisher
  async assignTerritory( territory: Territory, publisher: Publisher){
    const description = this.assignForm.value.description;
    const data_init = moment().format('DD-MM-YYYY');
  
    if( this.assignForm.disabled ){
      return;
    }

    if( !this.publisherSelected ){
      this.error = true;
      return;
    }

    await this.territoriesService.assignTerritory( territory, publisher, description, data_init );
    this.success = true;
    this.assignForm.disable();
  }

}
