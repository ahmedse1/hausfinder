import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss']
})
export class DirectionsComponent implements OnInit {

  @Input()
  duration!: number;
  @Input()
  distance!: number;
  @Input()
  steps!: any;


  constructor() { }


  ngOnInit() {

  }
}
