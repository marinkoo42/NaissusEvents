import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { bufferToggle, Observable, of } from 'rxjs';
import { myEvent } from 'src/app/models/myEvent';
import { HostingObject } from 'src/app/models/HostingObject';
import { AppState } from 'src/app/store/app-state';
import * as EventSelector from 'src/app/store/event/event.selector';
import * as EventActions from 'src/app/store/event/event.actions';
import { HostingObjectService } from 'src/app/services/hosting-object.service';
import { Loader } from '@googlemaps/js-api-loader';
import { formatDate } from '@angular/common';



@Component({
  selector: 'app-hosting-object',
  templateUrl: './hosting-object.component.html',
  styleUrls: ['./hosting-object.component.css']
})
export class HostingObjectComponent implements OnInit {

  ev: myEvent | null = null
  hostingObject: HostingObject | undefined = undefined;

  events$: Observable<myEvent[]> = of([]);

  shown: boolean = false;
  
  
  constructor(private store: Store<AppState>, private hoService: HostingObjectService, @Inject(LOCALE_ID) private locale: string) {
  
   }
  
  ngOnInit(): void {
    this.store.select(EventSelector.selectSelectedEvent).subscribe(
      (event) => this.ev = event
    );
    this.hostingObject = this.ev?.hostingObject;
    
    let loader = new Loader({
      apiKey: 'AIzaSyDFzGoHWrB0dwGhYCIduSqQJuSWzsaZEds'
    });



    loader.load().then(() => {
      let mapa = document.getElementById("map");
      if (mapa !== null) {
        let googleMap =
          new google.maps.Map(mapa, {
            center: { lat: 43.320904, lng: 21.89576 },
            zoom: 15,
            streetViewControl: false,
            mapTypeControl: false,            
          });
        this.codeAddress(new google.maps.Geocoder(), googleMap);
      }
    })
    

    this.getSlike();
    this.events$ = this.store.select(EventSelector.selectObjectEvents(this.hostingObject?.id ?? -1));
  }

  funkcija(ev:myEvent)
  {

    this.store.dispatch(EventActions.selectEvent({ eventId: ev.id }));
  }


  formatDate(datum: string | undefined) {
    return formatDate(datum ?? "", 'dd-MM-yyyy HH:mm', this.locale);
  }

  
  codeAddress(geocoder: google.maps.Geocoder, map: google.maps.Map) {
    geocoder.geocode({ 'address': this.hostingObject?.adress }, function (results, status) {
      if (status === 'OK' && results !== null) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        marker.setMap(map);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }



  getSlike() {   
    this.hoService.getSlikaObjekta(this.hostingObject?.id ?? 0).then(
      resp => {
        
        const str = "data:image/jpeg;base64, " + resp.data;        
        var img = document.getElementById("imageElement");
        img?.setAttribute("src", str);
        }
        
    )
  }

}
