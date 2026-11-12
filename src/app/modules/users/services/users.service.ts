import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserCustomer, UserRole } from '../models/user.interface';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from '@angular/fire/auth';

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
        async response => {
          const user: UserCustomer = {
            id_customer : response.user.uid,
            name : name,
            email : email,
            id_publisher : id_publisher,
            role : role
          }
          // Se espera a escribir el documento: si las reglas lo rechazan, el error llega al formulario
          await this.addUser( user );
          await updateProfile( response.user, {
            displayName: name
          });
        }
      );
  }

  // Solo para admins (las reglas de Firestore lo exigen)
  getUsers(): Observable<UserCustomer[]> {
    const usersRef = collection( this.firestore, 'users' );
    return collectionData( usersRef, { idField: 'id_customer' } ) as Observable<UserCustomer[]>;
  }

  updateRole( uid: string, role: UserRole ){
    return updateDoc( doc( this.firestore, 'users', uid ), { role } );
  }

  // Envia al usuario un correo para que elija una contrasena nueva. Desde el cliente no se
  // puede fijar la contrasena de otra cuenta (haria falta el Admin SDK / Cloud Functions).
  sendPasswordReset( email: string ){
    return sendPasswordResetEmail( this.auth, email );
  }

  // Revoca el acceso: borra el perfil. La cuenta de Firebase Auth no se borra desde el cliente.
  deleteUser( uid: string ){
    return deleteDoc( doc( this.firestore, 'users', uid ) );
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


