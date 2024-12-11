import { Component, OnDestroy, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { History } from '../../models/history.interface';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit, OnDestroy {

  public history: History[] = [];
  public initHistory: History[] = [];
  public destroyObs$: Subject<void> = new Subject();
  public filterForm: FormGroup = this.fb.group({
    month: [''],
    year: ['']
  })
  

  constructor( private historyService: HistoryService,
               private fb: FormBuilder ){}

  ngOnInit(): void{
    this.historyService.getHistory()
    .pipe(
      takeUntil(this.destroyObs$),
      map(history => {
        return history.sort((a, b) => {
          if (a.last_date && b.last_date) {
            return new Date(b.last_date).getTime() - new Date(a.last_date).getTime();
          } else {
            return -1; 
          }
        });
      })
    )
    .subscribe(sortedHistory => {
      this.history = sortedHistory;
      this.initHistory = sortedHistory;
    });
  }

  ngOnDestroy() {
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }

  filterHistory(){
    const dateCompare = this.filterForm.value.month + '-' + this.filterForm.value.year;
    this.history = this.initHistory.filter( item => moment(item.last_date.toString(), 'YYYYMMDD').format('DD-MM-YYYY').includes( dateCompare ) );
  }

}
