import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DatesService } from 'src/app/core/services/dates.service';
import { Publisher } from 'src/app/modules/publishers/models/publisher.interface';
import { PublishersService } from 'src/app/modules/publishers/services/publishers.service';
import { Territory } from 'src/app/modules/territories/models/territories.interface';
import { TerritoriesService } from 'src/app/modules/territories/services/territories.service';

@Component({
  selector: 'app-finish-territory',
  templateUrl: './finish-territory.component.html',
  styleUrls: ['./finish-territory.component.sass']
})
export class FinishTerritoryComponent {
  
  @Output()
  public childEvent = new EventEmitter<string>();

  // Getting parents values
  @Input()
  public territory!: Territory;

  @Input()
  public publisher!: Publisher;

  finalizedSuccessfully : boolean = false;

  constructor( private territoriesService: TerritoriesService,
               private publishersService: PublishersService,
               private router: Router,
               private dates: DatesService ){}

  async ngOnInit() {
    if( this.publisher.id ){
      const publish = await this.publishersService.getPublisherById( this.publisher.id );
      this.publisher = publish;
    }
  }

  async finish(){
    const territory = this.territory;
    const publisher = this.publisher;
    const date_end = this.dates.getCurrentDate();

    if( !publisher.id || !territory.id ) return;

    await this.territoriesService.finishTerritory(publisher, territory, date_end);
    this.finalizedSuccessfully = true;
  }

  hideModal(){
    this.childEvent.emit('d-none');
  }

}
