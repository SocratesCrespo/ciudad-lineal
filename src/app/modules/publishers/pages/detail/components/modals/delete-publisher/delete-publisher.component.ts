import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PublishersService } from 'src/app/modules/publishers/services/publishers.service';

@Component({
  selector: 'app-delete-publisher',
  templateUrl: './delete-publisher.component.html',
  styleUrls: ['./delete-publisher.component.sass']
})
export class DeletePublisherComponent {

  @Input()
  public idPublisher: string = '';

  @Output()
  public childEvent = new EventEmitter<string>();
  deletedSuccessfully: boolean = false;

  constructor( private publishersService: PublishersService ){}

  hideModal(){
    this.childEvent.emit('d-none');
  }

  deletePublisher(){
    if( this.idPublisher === '' || this.idPublisher === undefined ) return;
    this.publishersService.deletePublisher( this.idPublisher );
    this.deletedSuccessfully = true;
  }

}
