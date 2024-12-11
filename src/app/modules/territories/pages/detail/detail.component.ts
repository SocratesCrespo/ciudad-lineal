import { Component, OnDestroy, OnInit } from '@angular/core';
import { TerritoriesService } from '../../services/territories.service';
import { ActivatedRoute } from '@angular/router';
import { Territory } from '../../models/territories.interface';
import { PublishersService } from 'src/app/modules/publishers/services/publishers.service';
import { Observable, Subject, filter, firstValueFrom, forkJoin, from, mergeMap, of, takeUntil } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit, OnDestroy {
  
  public finishModalClass: string = 'd-none';
  public deleteModalClass: string = 'd-none';
  public territory!: Territory;
  public lastDate!: string;
  destroyObs$: Subject<void> = new Subject();

  constructor( private territoriesService: TerritoriesService,
               private activatedRoute: ActivatedRoute,
               private publishersService: PublishersService ){}
  
  
  async ngOnInit() {
    this.getTerritorySub();
  }

  ngOnDestroy(): void {
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }

  getTerritorySub(){
    this.activatedRoute.params.pipe( 
      filter( res => !!res ),
      mergeMap( ({ id }) => {
        return forkJoin({
          id: of( id ),
          territory: from( this.territoriesService.getTerritoryById( id ) ) 
        })
      }),
      takeUntil( this.destroyObs$ )
    ).subscribe( ({ id, territory }) => {
      this.territory = { id, ...territory }
    })
  }

  hideModal( value: string ){
    this.finishModalClass = value;
  }

  hideDeleteModal( value: string ){
    this.deleteModalClass = value;
  }

  async sendWhatsapp(){
    if( this.territory.publisher_id === '' || this.territory.publisher_id === undefined ) return;
    
    const publisher = await this.publishersService.getPublisherById( this.territory.publisher_id );
    const message = encodeURIComponent( `¡Hola ${ publisher.firstname }! \n\nSe te ha asignado el territorio *${ this.territory.number }* \n\nPuedes ver el mapa aquí: ${ this.territory.map }` );

    const url = `https://wa.me/34${ publisher.whatsapp }?text=${ message }`;
    window.open( url, '_blank' );
  }

}
