import { Component, OnInit } from '@angular/core';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../environments/environment';
import { MapboxService } from './services/mapbox.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Add a global variable to store the current transportation mode
  currentMode = "walking";
  // Keep track of the current popup
  currentPopup: mapboxgl.Popup = new mapboxgl.Popup;

  map!: mapboxgl.Map;

  end = [9.6842208, 50.5650941];

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
  }


  createPopup(type: string) {
    debugger;
    this.map.on("mousemove", type, (event) => {
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

      //distanceToCampus(feature);
    });
  }





  //************************ DIRECTIONS API

  // an arbitrary start will always be the same
  // only the end or destination will change


  // create a function to make a directions request

  // async getRoute(start: Number[], mode: string) {
  //   // an arbitrary start will always be the same
  //   // only the end or destination will change
  //   // const query = await fetch(
  //   //   `https://api.mapbox.com/directions/v5/mapbox/${mode}/${start[0]},${start[1]};${this.end[0]},${this.end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
  //   //   { method: "GET" }
  //   // );
  //   this.mapBoxService.getRoute(start, this.end, mode).subscribe(json => {
  //     const data = json.routes[0];
  //     const route = data.geometry.coordinates;
  //     const geojson: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> = {
  //       type: "Feature",
  //       properties: {},
  //       geometry: {
  //         type: "LineString",
  //         coordinates: route,
  //       },
  //     };
  //     // if the route already exists on the map, we'll reset it using setData
  //     const source = this.map.getSource("route");
  //     if (source && source instanceof mapboxgl.GeoJSONSource) {
  //       source.setData(geojson);
  //     }
  //     // otherwise, we'll make a new request
  //     else {
  //       this.map.addLayer({
  //         id: "route",
  //         type: "line",
  //         source: {
  //           type: "geojson",
  //           data: geojson,
  //         },
  //         layout: {
  //           "line-join": "round",
  //           "line-cap": "round",
  //         },
  //         paint: {
  //           "line-color": "#3887be",
  //           "line-width": 4,
  //           "line-opacity": 0.75,
  //         },
  //       });
  //     }

  //     const steps = data.legs[0].steps;
  //     let tripInstructions = "";
  //     for (const step of steps) {
  //       tripInstructions += `<li>${step.maneuver.instruction}</li>`;
  //     }
  //     // const instructions = document.getElementById("instructions");
  //     // instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
  //     //   data.duration / 60
  //     // )}  min <br>
  //     // Distance to campus: ${Math.floor(
  //     //   data.distance / 1000
  //     // )} km </strong></p><ol>${tripInstructions}</ol>`;
  //   });


  //   // add turn instructions here at the end

  //   // get the sidebar and add the instructions
  //   //const instructions = document.getElementById("instructions");



  // }

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
  /*
  function distanceToCampus(feature) {
    const coords = Object.keys(feature.geometry.coordinates).map(
      (key) => feature.geometry.coordinates[key]
    );
    const end = {
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
  
    if (map.getLayer("end")) {
      map.getSource("end").setData(end);
    } else {
      map.addLayer({
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
    getRoute(coords, currentMode);
  }
  */





  // Add a click event listener to the Get Directions button
  // Get the mode-select element
  //const modeSelect = document.getElementById("mode-select");

  // Add an event listener to listen for changes in the selected option
  /*
  modeSelect.addEventListener("change", function () {
    // Get the value of the selected option
    const selectedOption = modeSelect.value;
    currentMode = selectedOption;
    // Print the selected option in the console
    getRoute(end, currentMode);
  });
  */

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
