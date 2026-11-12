import { Component, OnDestroy, OnInit } from '@angular/core';
import { PublishersService } from '../../services/publishers.service';
import { Publisher } from '../../models/publisher.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit, OnDestroy {

  public displayCount = 9;
  public publishers: Publisher[] = [];
  loading: boolean = true;
  destroyObs$: Subject<void> = new Subject();
  private directorySynced: boolean = false;

  constructor( private publishersService: PublishersService ){}

  ngOnInit(): void {
    this.publishersService.getPublishers()
      .pipe( takeUntil( this.destroyObs$ ) )
      .subscribe(
        publishers => {
          this.publishers = publishers.sort( (a,b) => a.firstname.localeCompare(b.firstname) );
          this.loading = false;
          // Mantiene el directorio publico (usado por /auth/register) al dia
          if( !this.directorySynced ){
            this.directorySynced = true;
            this.publishersService.syncDirectory( this.publishers );
          }
        }
      )
  }

  ngOnDestroy(): void {
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }

  viewMore(){
    this.displayCount = this.displayCount + 9;
  }

}
