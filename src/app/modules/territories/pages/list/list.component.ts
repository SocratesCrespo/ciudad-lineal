import { Component, OnDestroy, OnInit } from '@angular/core';
import { TerritoriesService } from '../../services/territories.service';
import { Territory } from '../../models/territories.interface';
import { Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { DatesService } from 'src/app/core/services/dates.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit, OnDestroy {

  public displayCount: number = 100;
  public territories: Territory[] = [
    {
      number: 1,
      description: '',
      history: [],
      type: '',
      map: '',
      publisher: '',
      state: '',
      date_assigned: '',
      last_date: 0
    }
  ];
  public list!: Territory[];
  public listState: string = 'todos';
  destroyObs$: Subject<void> = new Subject();

  constructor( private territoriesService: TerritoriesService,
               private datesService: DatesService ){}

  ngOnInit(): void {
    this.territoriesService.getTerritories()
      .pipe( takeUntil( this.destroyObs$ ) )
      .subscribe(
        territories => {
          this.territories = territories;
          this.list = territories.sort( (a,b) => a.number - b.number );
        })
  }

  ngOnDestroy(): void {
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }

  viewMore(){
    this.displayCount = this.displayCount + 100;
  }

  filterList( state: string ){
    if( state == 'todos' ){
      this.list = this.territories;
      this.listState = 'todos';
      return;
    }

    this.list = this.territories
      .filter( territory => territory.state == state )
      .sort( (a,b) => a.last_date - b.last_date );

    this.listState = state;
      
  }

  endDate( date: number ){
    const finish = date.toString();
    const end_date = moment( finish, 'YYYYMMDD' ).format('DD-MM-YYYY');

    return end_date;
  }

  toExpire( date: number ): number{
    return this.datesService.dateToExpire( date );
  }

}
