import { Component, OnInit, ViewChild } from '@angular/core';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { DirectionsComponent } from '../../directions/directions/directions.component';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  // Add a global variable to store the current transportation mode
  currentMode = "walking";
  // Keep track of the current popup
  currentPopup: mapboxgl.Popup = new mapboxgl.Popup;

  map!: mapboxgl.Map;

  steps: any
  duration: number = 0;
  distance: number = 0;

  @ViewChild(DirectionsComponent)
  direction!: DirectionsComponent;

  constructor() { }


  ngOnInit() {
    // setting the value of accessToken
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: environment.mapbox.style,
      center: [9.680845, 50.555809],
      zoom: 11.7,
    });
    /* 
    Add an event listener that runs
    when a user hovers over the map element.
    */
    this.createPopup("wg-v14");
    this.createPopup("dorm-v12");
    this.createPopup("studio-v11");


    // ******************************* SEARCH BAR CODE


    const geocoder = new MapboxGeocoder({
      // Initialize the geocoder
      accessToken: mapboxgl.accessToken, // Set the access token
      mapboxgl: mapboxgl, // Set the mapbox-gl instance
      marker: false, // Do not use the default marker style
      placeholder: "Search for places", // Placeholder text for the search bar
      //bbox: [-87.661557, 41.893748, -87.661557, 41.893748],
      // proximity: {
      //     longitude: -87.661557,
      //     latitude: 41.893748
      // }
    });

    // Add the geocoder to the map
    this.map.addControl(geocoder);

    // After the map style has loaded on the page,
    // add a source layer and default styling for a single point
    // this.map.on("load", () => {
    //   this.map.addSource("single-point", {
    //     type: "geojson",
    //     data: {
    //       type: "FeatureCollection",
    //       features: [],
    //     },
    //   });

    //   this.map.addLayer({
    //     id: "point",
    //     source: "single-point",
    //     type: "circle",
    //     paint: {
    //       "circle-radius": 5,
    //       "circle-color": "#448ee4",
    //     },
    //   });

    //   // Listen for the `result` event from the Geocoder
    //   // `result` event is triggered when a user makes a selection
    //   //  Add a marker at the result's coordinates
    //   // geocoder.on("result", (event) => {
    //   //   this.map.getSource("single-point").setData(event.result.geometry);
    //   // });
    // });

    //this.getRoute(this.end, this.currentMode);
  }


  createPopup(type: string) {
    debugger;
    this.map.on("click", type, (event) => {
      const features = this.map.queryRenderedFeatures(event.point, {
        layers: [type]
      });
      if (!features.length) {
        return;
      }
      const feature = features[0];

      // Close the current popup if it exists
      if (this.currentPopup) {
        this.currentPopup.remove();
      }

      // WILL CHECK THIS PART LATER
      // if (feature.geometry.type === 'Point') {
      //   const coords = Object.keys(feature.geometry.coordinates).map(
      //     (key) => feature.geometry.coordinates[key]
      //   );
      // }
      // WILL CHECK THIS PART LATER

      // Create a new popup and set its properties
      const popup = new mapboxgl.Popup({
        offset: [0, -15],
        maxWidth: "300px",
        className: "custom-popup",
      })
        .setLngLat([
          Number(event.lngLat.lng),
          Number(event.lngLat.lat)
        ])
        .setHTML(
          `<div style="display: flex">
              <h2>${feature.properties?.['Name']}</h2>
              <h4 style="margin-left: 20px; color:#1754d7">Ratings: ${feature.properties?.['Ratings']}</h4>
            </div>
            <hr>
            <div class="w3-content w3-display-container">
              <img id="defaultImage" src="https://rb.gy/5qcuk" width=270px height=150px>
              <img class="mySlides" src="https://rb.gy/8rarv" width=270px height=150px>
              <img class="mySlides" src="https://rb.gy/k6wfb" width=270px height=150px>
              <img class="mySlides" src="https://rb.gy/5qcuk" width=270px height=150px>
            </div>
  
  
            <h3>Rent: €${feature.properties?.['Rent']}</h3>
            <p><strong>Address: </strong>${feature.properties?.['Address']}</p>
            <p><strong>Description: </strong>${feature.properties?.['Description']}</p>
            <p><strong>Amenities: </strong>${feature.properties?.['Amenities']}</p>
            <p><strong>Roommates: </strong>${feature.properties?.['Roommates']}</p>
            <hr>
            <p><strong>Reviews: </strong>${feature.properties?.['Reviews']}</p>
            `
        )
        .addTo(this.map);

      // Update the current popup
      this.currentPopup = popup;

      this.distanceToCampus(feature);
    });
  }





  //************************ DIRECTIONS API

  // an arbitrary start will always be the same
  // only the end or destination will change


  // create a function to make a directions request



  /*
  map.on("load", () => {
// make an initial directions request that
// starts and ends at the same location
getRoute(end, currentMode);

// Add starting point to the map, ADDING FOR HOCHSHULE 
map.addLayer({
  id: "end",
  type: "symbol", // Change the type to 'symbol'
  source: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: end,
          },
        },
      ],
    },
  },
  layout: {
    "icon-image": "https://ibb.co/gSN6NKT", // Replace 'your-icon-image' with the actual name of your icon image
    "icon-size": 1.5, // Adjust the size of the icon if needed
    "icon-anchor": "bottom", // Adjust the anchor position if needed
  },
  paint: {},
});
// this is where the code from the next step will go
});

*/

  // DISTANCE TO CAMPUS FUNCTION

  distanceToCampus(feature: any) {
    const coords = Object.keys(feature.geometry.coordinates).map(
      (key) => feature.geometry.coordinates[key]
    );
    const end: GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: coords,
          },
        },
      ],
    };

    if (this.map.getLayer("end")) {
      const source = this.map.getSource("end");
      if (source && typeof source === "object" && "setData" in source) {
        source.setData(end);
      }
    } else {
      this.map.addLayer({
        id: "end",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: coords,
                },
              },
            ],
          },
        },
        paint: {
          "circle-radius": 5,
          "circle-color": "#f30",
        },
      });
    }
    this.direction.getRoute(coords);
  }


  // const imageUrl = [
  //   "https://rb.gy/5qcuk",
  //   "https://rb.gy/8rarv",
  //   "https://rb.gy/k6wfb",
  // ];

  //Slider Func

  //var slideIndex = 0;
  //var slides = document.getElementsByClassName("mySlides"); // Define slides variable in the global scope

  // function plusDivs(n) {
  //   slideIndex += n;
  //   showSlide(slideIndex);
  // }

  /*
  function showSlide(index) {
    if (index >= slides.length) {
      slideIndex = 0;
    } else if (index < 0) {
      slideIndex = slides.length - 1;
    }
    document.getElementById("defaultImage").src = slides[slideIndex].src;
  }
  */

  // Function to automatically change slide every 2 seconds

  /*
  setInterval(function () {
    slideIndex++;
    showSlide(slideIndex);
  }, 2000);
  
  // Show the default slide on page load
  window.addEventListener("DOMContentLoaded", function () {
    showSlide(slideIndex);
  });
   
  }
  */

}
