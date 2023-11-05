import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DirectionsComponent } from './directions/directions/directions.component';
//import { SignupComponent } from './signup/signup/signup.component';
import { MapComponent } from './map/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    DirectionsComponent,
    //SignupComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
