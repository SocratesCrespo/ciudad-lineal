import { Injectable, inject } from '@angular/core';
import { AuthService } from '../authentication/services/auth.service';
import { Router, UrlSegment } from '@angular/router';
import { tap } from 'rxjs';


export class GuardService {

  constructor(){}

  isCustomer( role: string ): boolean{
    if( role === 'customer' ) return true;
    return false;
  }

  isAdmin( role: string ): boolean{
    if( role === 'admin' ) return true;
    return false;
  }
};
