import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

(mapboxgl as any).accessToken = 'pk.eyJ1Ijoic29jcmF0ZXMwNyIsImEiOiJja2Vic2J3N2EwNHpnMnJwM3BxYjRpNmljIn0.z8h9prgkhfrOew0efQz1Gg';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements AfterViewInit {

  @ViewChild('map') divMap?: ElementRef

  ngAfterViewInit(): void {

  if ( !this.divMap ) throw 'El elemento no fue encontrado' ;
    
  const map = new mapboxgl.Map({
    container: this.divMap.nativeElement, // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-3.6505715, 40.437596], // starting position [lng, lat]
    zoom: 13 // starting zoom
  });

  } 

  

}
