import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, filter, forkJoin, from, mergeMap, of, takeUntil } from 'rxjs';
import { Publisher } from 'src/app/modules/publishers/models/publisher.interface';
import { PublishersService } from 'src/app/modules/publishers/services/publishers.service';
import * as moment from 'moment';
import 'moment/locale/es';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit, OnDestroy {

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

  public hasMovements: boolean = false;
  
  public destroyObs$: Subject<void> = new Subject;

  constructor( 
    private publishersService: PublishersService,
    private activatedRoute: ActivatedRoute,
   ){}

  ngOnInit(): void {
      moment.locale('es');
      this.getPublisher();
  }

  ngOnDestroy(): void {
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }

  getPublisher(){
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
      const movements = this.publisher.history.filter( movement => movement.date_end !== '-' );
      if( movements.length > 0 ) this.hasMovements = true;
    });
  }

  getTerritoryDate( number: number ){
    const territory = this.publisher.history.filter( movement => movement.territory === number && movement.date_end === '-' );

    if( territory.length > 1 ){
      let currentAssigned = territory.sort( (a,b) => Number(moment( a.date_init, 'DD-MM-YYYY' ).format('YYYYMMDD')) - Number(moment( b.date_init, 'DD-MM-YYYY' ).format('YYYYMMDD')) );
      return moment(currentAssigned[0]['date_init'], 'DD-MM-YYYY').fromNow();
    }

    return moment(territory[0]['date_init'], 'DD-MM-YYYY').fromNow();
  }

}
