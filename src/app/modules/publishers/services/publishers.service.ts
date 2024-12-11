import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Publisher } from '../models/publisher.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublishersService {

  constructor( private firestore: Firestore ) { }

  addPublisher( publisher: Publisher ){
    const publisherRef = collection(this.firestore, 'publishers');
    return addDoc( publisherRef, publisher );
  }

  getPublishers(): Observable<Publisher[]> {
    const publisherRef = collection( this.firestore, 'publishers' );
    return collectionData( publisherRef, { idField: 'id' } ) as Observable<Publisher[]>;
  }

  async getPublisherById( id: string ): Promise<any> {
    const publishRef = doc( this.firestore, 'publishers', id );
    try{
      const publishSnap = await getDoc(publishRef); 
      return publishSnap.data();
    }
    catch(error){
      console.error('Error en la promesa:', error);
    }
  }

  async editPublisher( publisher: Publisher ){
    if( publisher.id === '' || publisher.id === undefined ) return;
    const publishRef = doc( this.firestore, 'publishers', publisher.id );
    try{
      const publiSnap = await updateDoc(
        publishRef,
         { 
          firstname: publisher.firstname.trim(),
          lastname: publisher.lastname.trim(),
          publisherType: publisher.publisherType.trim(),
          email: publisher.email.trim(),
          phone: publisher.phone.trim(),
          whatsapp: publisher.whatsapp.trim(),
          address: publisher.address.trim(),
          description: publisher.description.trim()
         }
       );
     }catch(error){
       console.log(error);
     }
  }

  deletePublisher( id: string ){
    deleteDoc( doc( this.firestore, 'publishers', id ) );
  }
}
