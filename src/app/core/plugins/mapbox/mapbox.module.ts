import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as mapboxgl from 'mapbox-gl';
(mapboxgl as any).accessToken = 'pk.eyJ1Ijoic29jcmF0ZXMwNyIsImEiOiJja2Vic2J3N2EwNHpnMnJwM3BxYjRpNmljIn0.z8h9prgkhfrOew0efQz1Gg';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
  ]
})
export class MapboxModule { }
