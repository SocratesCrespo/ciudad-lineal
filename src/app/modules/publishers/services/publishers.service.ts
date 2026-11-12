import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { Publisher, PublisherDirectoryEntry } from '../models/publisher.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublishersService {

  constructor( private firestore: Firestore ) { }

  async addPublisher( publisher: Publisher ){
    const publisherRef = collection(this.firestore, 'publishers');
    const created = await addDoc( publisherRef, publisher );
    await this.setDirectoryEntry( created.id, publisher.firstname, publisher.lastname );
    return created;
  }

  // Directorio publico (solo nombre y apellido): lo usa la pantalla de registro,
  // que se muestra sin sesion y no puede leer la coleccion 'publishers'.
  getPublisherDirectory(): Observable<PublisherDirectoryEntry[]> {
    const directoryRef = collection( this.firestore, 'publisherDirectory' );
    return collectionData( directoryRef, { idField: 'id' } ) as Observable<PublisherDirectoryEntry[]>;
  }

  private setDirectoryEntry( id: string, firstname: string, lastname: string ){
    return setDoc( doc( this.firestore, 'publisherDirectory', id ), {
      firstname: firstname.trim(),
      lastname: lastname.trim()
    });
  }

  // Deja el directorio igual que 'publishers': crea lo que falta, corrige nombres
  // y borra entradas huerfanas. Es idempotente; sirve de relleno inicial.
  async syncDirectory( publishers: Publisher[] ){
    try{
      const snap = await getDocs( collection( this.firestore, 'publisherDirectory' ) );
      const current = new Map( snap.docs.map( d => [ d.id, d.data() ] ) );
      const wanted = new Set( publishers.map( p => p.id ) );
      const jobs: Promise<void>[] = [];

      for( const p of publishers ){
        if( !p.id ) continue;
        const entry = current.get( p.id );
        if( !entry || entry['firstname'] !== p.firstname.trim() || entry['lastname'] !== p.lastname.trim() ){
          jobs.push( this.setDirectoryEntry( p.id, p.firstname, p.lastname ) );
        }
      }
      for( const id of current.keys() ){
        if( !wanted.has( id ) ) jobs.push( deleteDoc( doc( this.firestore, 'publisherDirectory', id ) ) );
      }
      await Promise.all( jobs );
    }catch(error){
      console.error('No se pudo sincronizar el directorio de publicadores:', error);
    }
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
       await this.setDirectoryEntry( publisher.id, publisher.firstname, publisher.lastname );
     }catch(error){
       console.log(error);
     }
  }

  async deletePublisher( id: string ){
    await Promise.all([
      deleteDoc( doc( this.firestore, 'publishers', id ) ),
      deleteDoc( doc( this.firestore, 'publisherDirectory', id ) )
    ]);
  }
}
