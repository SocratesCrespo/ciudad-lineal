import { Component, OnDestroy, OnInit } from '@angular/core';
import { TerritoriesService } from '../../services/territories.service';
import { ActivatedRoute } from '@angular/router';
import { Territory } from '../../models/territories.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-territory',
  templateUrl: './edit-territory.component.html',
  styleUrls: ['./edit-territory.component.sass']
})
export class EditTerritoryComponent implements OnInit, OnDestroy {

  public territory!: Territory;
  public editForm: FormGroup = this.fb.group({
    number: [ this.territory !== undefined ? this.territory.number : 0, [Validators.min(1)] ],
    type: [ this.territory !== undefined ? this.territory.type : '', [Validators.required] ],
    map: ['https::', [Validators.minLength(7), Validators.required]],
    description: ['']
  });
  formErrors: boolean = false;
  success: boolean = false;
  destroyObs$: Subject<void> = new Subject();

  constructor( private territoriesService: TerritoriesService,
               private activatedRoute: ActivatedRoute,
               private fb: FormBuilder ){}

 async ngOnInit() {
    this.activatedRoute.params
      .pipe( takeUntil( this.destroyObs$ ) )
      .subscribe(
       async ({ id }) => {
          const territoryData = await this.territoriesService.getTerritoryById( id );
          this.territory = await { id, ...territoryData };
          this.editForm.patchValue({
            number: this.territory.number,
            type: this.territory !== undefined ? this.territory.type : '',
            map: this.territory.map,
            description: this.territory.description
          });
        }
      );
  }

  ngOnDestroy(): void {
    this.destroyObs$.next();
    this.destroyObs$.complete();
  }

  // Edit this territory
  async edit(){
    const id = this.territory !== undefined ? this.territory.id : '';

    if( this.editForm.invalid ){
      this.formErrors = true;
      return;
    }

    await this.territoriesService.editTerritory( 
        id,
        this.editForm.value.number,
        this.editForm.value.type,
        this.editForm.value.map,
        this.editForm.value.description,
       );

    this.formErrors = false;
    this.success = true;

  }

}
