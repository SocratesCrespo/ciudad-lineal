import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

// Boton "Volver" reutilizable. Navega siempre a una ruta explicita (no al historial
// del navegador) para que funcione tambien si la pantalla se abrio directamente.
// Es standalone: se importa en el modulo que lo use, sin depender de SharedModule.
@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [ RouterModule ],
  template: `
    <button type="button" class="btn btn-tonal" [routerLink]="link">{{ label }}</button>
  `
})
export class BackButtonComponent {

  @Input({ required: true })
  public link: string | any[] = '/';

  @Input()
  public label: string = 'Volver';

}
