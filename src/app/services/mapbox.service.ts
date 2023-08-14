import { Injectable } from '@angular/core';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  private token: string = environment.mapbox.accessToken;
  constructor(private httpClient: HttpClient) {
  }

  // public getRoute(start: Number[], end: Number[], mode: string): Observable<any> {
  //   const api = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${start[0]},${start[1]};${end[0]},${end[1]}`;
  //   return this.httpClient
  //     .get(api, {
  //       params: {
  //         steps: 'true',
  //         geometries: 'geojson',
  //         access_token: this.token
  //       },
  //       responseType: 'json',
  //     })
  //     .pipe(catchError(_ => of('Error fetching route')));
  // }
}
