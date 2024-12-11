import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { History } from '../models/history.interface';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor( private firestore: Firestore ) { }

  getHistory(): Observable<History[]>{
    const historyRef = collection( this.firestore, 'movements' );
    return collectionData( historyRef, { idField: 'id' } ) as Observable<History[]>;
  }
}
