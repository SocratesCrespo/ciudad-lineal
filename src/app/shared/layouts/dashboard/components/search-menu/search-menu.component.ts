import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/services/auth.service';
import { Publisher } from 'src/app/modules/publishers/models/publisher.interface';
import { PublishersService } from 'src/app/modules/publishers/services/publishers.service';
import { Territory } from 'src/app/modules/territories/models/territories.interface';
import { TerritoriesService } from 'src/app/modules/territories/services/territories.service';

@Component({
  selector: 'app-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrls: ['./search-menu.component.sass']
})
export class SearchMenuComponent implements OnInit {

  public territories!: Territory[];
  public publishers!: Publisher[];
  public displayList: boolean = false;
  public currentUser: string = '';
  destroyObs$: Subject<void> = new Subject();

  public searchForm: FormGroup = this.fb.group({
    search: ['', [ Validators.required, Validators.minLength(1) ]]
  });

  constructor( private publishersService: PublishersService,
               private territoriesService: TerritoriesService,
               private fb: FormBuilder,
               private auth: AuthService,
               private router: Router ){}

  ngOnInit() {
    const user = localStorage.getItem( 'name' );
    if( user ){
      this.currentUser = user;
    }
  }

  getList(){
    const value = this.searchForm.value.search;

    if( value === null ) return;

    if( value == 0 || value == '' ){
      this.displayList = false;
      if( this.territories !== undefined ) this.territories.length = 0;
      if( this.publishers !== undefined ) this.publishers.length = 0;

      return;
    }

    // If is a number get territories
    if( !isNaN( Number(value) ) ){
      this.territoriesService.getTerritories()
        .pipe( takeUntil( this.destroyObs$ ) ) 
        .subscribe(
            territories => {
              territories = territories.sort( (a, b) => a.number - b.number );
              this.territories = territories.filter( territory => territory.number.toString().includes(value.toString()) );
              this.displayList = true;
            }
          );
    } 

    // If is a string get publishers
    if( isNaN( Number(value) ) ) {
      this.publishersService.getPublishers()
        .pipe( takeUntil( this.destroyObs$ ) )  
        .subscribe(
            publishers => {
              this.publishers = publishers.filter( publisher => this.normalizeString(publisher.firstname).toLowerCase().includes(this.normalizeString(value).toLowerCase()) );
              this.displayList = true;
            }
        );
    }

  }

  hidelist(){
    const value = this.searchForm.value.search;
    if( value == 0 || value == '' ){
      this.displayList = false;
      this.searchForm.reset();
    } 
  }

  selectItem(){
    this.displayList = false;
    if( this.territories !== undefined ) this.territories.length = 0;
    if( this.publishers !== undefined ) this.publishers.length = 0;
    this.searchForm.reset();
    this.destroyObs();
  }

  destroyObs(){
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }

  normalizeString(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  logOut(){
    this.auth.logout()
      .then( () => this.router.navigate(['auth']) );
  }

}
