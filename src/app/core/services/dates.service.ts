import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  public formattedDate!: string;

  constructor() { }

  getCurrentDate(): string{
    // Get and formatting end date
    const currentDate: Date = new Date();

    const day: number = currentDate.getDate();
    const month: number = currentDate.getMonth() + 1;
    const year: number = currentDate.getFullYear();

    const formattedDay: string = (day < 10) ? '0' + day : day.toString();
    const formattedMonth: string = (month < 10) ? '0' + month : month.toString();

    this.formattedDate = formattedDay + '-' + formattedMonth + '-' + year;

    return this.formattedDate;
  }

  // Get last date from territory
  dateToExpire( last_date: number ){
    const formatDate = last_date.toString();
    const expDAte = moment(formatDate, 'YYYYMMDD').fromNow();
    
    if( expDAte.substring(0,1) === 'a' ){
      return 1;
    }

    if( expDAte.includes('days') ){
      return 0.5;
    }

    if( expDAte.includes('age') ){
      return 12;
    }

    return Number(expDAte.substring(0,1));
  }
}
