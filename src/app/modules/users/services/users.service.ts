import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { UserCustomer } from '../models/user.interface';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor( private firestore: Firestore,  private auth: Auth ) { }

  async addUser( user: UserCustomer ){
    let id: string = '';
    if( user.id_customer ){
      id = user.id_customer;
    } else {
      id = '';
    }
    /* const userRef = collection(this.firestore, 'users'); */
    return await setDoc( doc(this.firestore, 'users', id), user );
  }

  async registerCustomer( email: string, password: string, name: string, id_publisher: string, role: string ){
    return await createUserWithEmailAndPassword( this.auth, email, password )
      .then(
        response => {
          updateProfile( response.user, {
            displayName: name
          });
          const user: UserCustomer = {
            id_customer : response.user.uid,
            name : name,
            email : email,
            id_publisher : id_publisher,
            role : role
          }
          this.addUser( user );
        }
      );
  }

  async getUserById( id: string ): Promise<any>{
    const userRef = doc( this.firestore, 'users', id );
    try{
      const userSnap = await getDoc(userRef); 
      return userSnap.data();
    }
    catch(error){
      console.error('Error en la promesa:', error);
    }
  }
}


