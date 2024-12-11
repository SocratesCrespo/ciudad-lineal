import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { History } from 'src/app/modules/history/models/history.interface';
import { HistoryService } from 'src/app/modules/history/services/history.service';

@Component({
  selector: 'app-history-info',
  templateUrl: './history-info.component.html',
  styleUrls: ['./history-info.component.sass']
})
export class HistoryInfoComponent implements OnInit, OnDestroy {

  public history!: History[];
  public destroyObs$: Subject<void> = new Subject;
  loading: boolean = true;

  constructor( private historyServices: HistoryService ){}

  ngOnInit(): void {
    this.historyServices.getHistory()
    .pipe(
      takeUntil(this.destroyObs$),
      map(history => {
        return history.sort((a, b) => {
          if (a.date_end !== '-' && b.date_end !== '-') {
            return new Date(b.date_end).getTime() - new Date(a.date_end).getTime();
          } else if (a.date_end === '-' && b.date_end === '-') {
            return new Date(b.date_init).getTime() - new Date(a.date_init).getTime();
          } else if (a.date_end === '-') {
            return 1; 
          } else {
            return -1; 
          }
        }).slice(0, 3);
      })
    )
    .subscribe(sortedHistory => {
      this.history = sortedHistory;
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }

}
