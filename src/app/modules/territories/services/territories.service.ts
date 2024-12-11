import { Injectable } from '@angular/core';
import { Firestore, addDoc, arrayRemove, arrayUnion, collection, collectionData, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Territory } from '../models/territories.interface';
import { Observable } from 'rxjs';
import { Publisher } from '../../publishers/models/publisher.interface';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TerritoriesService {

  constructor( private firestore: Firestore ) {}

  addTerritory( territory: Territory ){
    const territoryRef = collection(this.firestore, 'territories');
    return addDoc( territoryRef, territory );
  }

  getTerritories(): Observable<Territory[]>{
    const territoryRef = collection( this.firestore, 'territories' );
    return collectionData( territoryRef, { idField: 'id' } ) as Observable<Territory[]>;
  }

  async getTerritoryById( id: string ): Promise<any> {
    const terrRef = doc( this.firestore, 'territories', id );
    try{
      const terrSnap = await getDoc(terrRef); 
      return terrSnap.data();
    }
    catch(error){
      console.log(error);
    }
  }

  async assignTerritory( territory: Territory, publisher: Publisher, description: string, date_init: string ): Promise<any>{
    const publisher_id = publisher.id ? publisher.id : '';
    const territory_id = territory.id ? territory.id : '';
    const terrRef = doc( this.firestore, 'territories', territory_id );
    const publiRef = doc( this.firestore, 'publishers', publisher_id );
    const moveRef = collection(this.firestore, 'movements');
    const last_date = moment().format('YYYYMMDD');

    // Script for territory
    try{
     const terrSnap = await updateDoc( terrRef,
       { state: 'Assigned',
         publisher: publisher.firstname.trim() + ' ' + publisher.lastname.trim(),
         publisher_id: publisher.id,
         date_assigned: date_init,
         last_date: Number(last_date)
       });
    }
    catch(error){
      console.log(error);
    }

    // Script Publisher
    try{
      const publiSnap = await updateDoc(
        publiRef,
        {
          territories: arrayUnion( territory.number ),
          history: arrayUnion({
            territory: territory.number,
            date_init: date_init,
            date_end: '-'
          })
        }
      )

    }catch(error){
      console.log(error);
    }

    // Script Movements
    try{
      addDoc(
        moveRef,
        {
          date_init: date_init,
          date_end: '-',
          last_date: Number(last_date),
          publisher: publisher.firstname + ' ' + publisher.lastname,
          subject: 'Asignado',
          territory: territory.number,
          description: description
        }
      )
    }catch(error){
      console.log(error);
    }

  }

  async finishTerritory( publisher: Publisher, territory: Territory, date_end: string ): Promise<any>{
    const publisher_id = publisher.id ? publisher.id : '';
    const territory_id = territory.id ? territory.id : '';
    const publiRef = doc( this.firestore, 'publishers', publisher_id );
    const terrRef = doc( this.firestore, 'territories', territory_id );
    const moveRef = collection(this.firestore, 'movements');
    const last_date = moment().format('YYYYMMDD');

    // Script Territory
    try{
     const terrSnap = await updateDoc(
        terrRef,
        { 
          state: 'Not assigned',
          publisher: '',
          history: arrayUnion({
            date_init: territory.date_assigned,
            date_end: date_end,
            publisher: publisher.firstname.trim() + ' ' + publisher.lastname.trim(),
          }),
          last_date: Number(last_date),
          publisher_id: ''
        }
      );
    }catch(error){
      console.log(error);
    }

    // Script Publisher
    try{
      const publiSnap = await updateDoc(
        publiRef,
        {
          territories: arrayRemove( territory.number ),
          history: arrayUnion({
            territory: territory.number,
            date_init: territory.date_assigned,
            date_end: date_end
          })
        }
      )

    }catch(error){
      console.log(error);
    }

    // Script Movements
    try{
      addDoc(
        moveRef,
        {
          date_init: territory.date_assigned,
          date_end: date_end,
          last_date: Number(last_date),
          publisher: publisher.firstname + ' ' + publisher.lastname,
          subject: 'Terminado',
          territory: territory.number
        }
      )
    }catch(error){
      console.log(error);
    }
  }

  async editTerritory( id: string | undefined, number: number, type: string, map: string, description: string ){
    if( id === undefined || id === '' ) return;
    const terrRef = doc( this.firestore, 'territories', id );

    // Script Territory
    try{
      const terrSnap = await updateDoc(
         terrRef,
         { 
           number: number,
           type: type.trim(),
           map: map.trim(),
           description: description.trim()
         }
       );
     }catch(error){
       console.log(error);
     }
  }

  deleteTerritory( id: string ){
    deleteDoc( doc( this.firestore, 'territories', id ) );
  }
  
}
