import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TerritoriesService } from 'src/app/modules/territories/services/territories.service';

@Component({
  selector: 'app-delete-territory',
  templateUrl: './delete-territory.component.html',
  styleUrls: ['./delete-territory.component.sass']
})
export class DeleteTerritoryComponent {

  deletedSuccessfully: boolean = false;

  @Output()
  public childEvent = new EventEmitter<string>();

  @Input()
  public idTerritory!: string;

  constructor( private territoriesService: TerritoriesService ){}

  hideModal(){
    this.childEvent.emit('d-none');
  }

  deleteTerritory(){
    if( this.idTerritory === '' || this.idTerritory === undefined ) return;
    this.territoriesService.deleteTerritory( this.idTerritory );
    this.deletedSuccessfully = true;
  }

}
