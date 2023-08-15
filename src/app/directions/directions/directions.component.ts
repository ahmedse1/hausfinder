import { Component, Input, OnInit } from '@angular/core';
import { MapboxService } from 'src/app/services/mapbox.service';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss']
})
export class DirectionsComponent implements OnInit {

  duration: number;

  distance: number;

  steps: any;

  @Input()
  map!: mapboxgl.Map;

  end: [number, number]

  constructor(private mapBoxService: MapboxService) {
    this.duration = 0.1;
    this.distance = 0;
    this.end = [9.6842208, 50.5650941];
  }


  ngOnInit() {

  }

  async getRoute(start: Number[], mode: string) {
    debugger
    const json = await this.mapBoxService.getRoute(start, this.end, mode);

    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    };
    // if the route already exists on the map, we'll reset it using setData
    const source = this.map.getSource("route");
    debugger;
    if (source && typeof source === "object" && "setData" in source) {
      source.setData(geojson);
    }

    // otherwise, we'll make a new request
    else {
      this.map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: geojson,
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 4,
          "line-opacity": 0.75,
        },
      });
    }

    this.steps = data.legs[0].steps;
    this.duration = Math.floor(data.duration / 60);
    this.distance = Math.floor(data.distance / 1000);

  }
}
