import { Component, OnInit,  EventEmitter, Output, Inject, LOCALE_ID } from '@angular/core';
import { HostingObject } from 'src/app/models/HostingObject';
import { User } from 'src/app/models/User';
import { AppState } from 'src/app/store/app-state';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector';
import * as HostingObjectActions from 'src/app/store/hostingObject/hostingObject.actions';
import { HostingObjectService } from 'src/app/services/hosting-object.service';
import { buffer, map, Observable, of } from 'rxjs';
import { myEvent } from 'src/app/models/myEvent';
import * as EventActions from 'src/app/store/event/event.actions';
import * as EventSelector from 'src/app/store/event/event.selector';
import { Table, tableType } from 'src/app/models/Table';
import { formatDate } from '@angular/common';
import { EventService } from 'src/app/services/event.service';
import { Loader } from '@googlemaps/js-api-loader';





@Component({
  selector: 'app-moderators-object',
  templateUrl: './moderators-object.component.html',
  styleUrls: ['./moderators-object.component.css']
})
export class ModeratorsObjectComponent implements OnInit {

  slikaDodata: boolean = false;
  dodavanjeEventa: boolean = false;
  imaSliku: boolean = false;
  selectedFile: File = new File([],"-1");
  dodavanje: boolean = false;
  Tip: string[] = ['Barski', 'Separe', 'Niski sto', 'Sank'];
  selektovanTip: any;
  selektovanKapacitet: number | null = null;
  hostingObject: HostingObject | null = null;
  events: myEvent[] | null = null;
  
  moderator : Observable<User |null>  = of();
  
     forma = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      hours: new FormControl('', [Validators.required]), 
      phone: new FormControl('', [Validators.required])   
    }
  )

     dodajEventForma = new FormGroup(
    {
      
      imeDogadjaja: new FormControl('', [Validators.required]),
      opisDogadjaja: new FormControl('', [Validators.required]),
      
      date: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required])
    }
  )

    dodajStoForma = new FormGroup(
    {
      tip: new FormControl('', [Validators.required]),
      kapacitet: new FormControl('', [Validators.required,Validators.pattern(/^[0-9]\d*$/)]),
     
    }
  )

  constructor(private store: Store<AppState>, private formBuilder: FormBuilder, private hoService: HostingObjectService,@Inject(LOCALE_ID) private locale: string,private eventService:EventService) {
   
    this.store.select(KorisnikSelector.selectUlogovanKorisnik).subscribe(k => {
      this.moderator = of(k);

    });
    
    this.moderator.subscribe(mod => {
      if (mod?.id !== "-1")
        this.hoService.getHostingObjectOfModerator(mod?.id ?? "-1").subscribe(o => {
          this.hostingObject = o;
          this.generateFormGroup();
          this.getSlike();
          

          this.store.select(EventSelector.selectObjectEvents(this.hostingObject.id)).subscribe(ev => this.events = ev);
          
     

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
        })
    }).unsubscribe()
}

  ngOnInit(): void { 
    
    
    this.forma.disable();
  }


    codeAddress(geocoder :google.maps.Geocoder, map: google.maps.Map) {
    geocoder.geocode({ 'address': this.hostingObject?.adress }, function (results, status) {
      if (status === 'OK' && results!==null) {
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



  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
      console.log("FileUpload -> files", fileList[0]);
      this.slikaDodata = !this.slikaDodata;


    }
  }

  dodajSliku() {
    if (this.selectedFile.name !== "-1") {
      this.imaSliku = !this.imaSliku;
      const formData = new FormData();
      console.log("Dodaj");
      formData.append("file", this.selectedFile);
      this.hoService.dodajSlikuObjekta(this.hostingObject?.id ?? 0, formData).then(p => this.getSlike());
    }
  }
  obrisiSliku() {
    this.imaSliku = !this.imaSliku;
    this.hoService.deleteSlikuObjekta(this.hostingObject?.id ?? 0).then(p => {

      var img = document.getElementById("imageElementObj");
      img?.setAttribute("src", "");
      
    });
  }

 
  getSlike() {
    this.hoService.getSlikaObjekta(this.hostingObject?.id ?? 0).then(
      resp => {
        
        if (resp.data.length > 0) {
          this.imaSliku = true;
        }
        const str = "data:image/jpeg;base64, " + resp.data;
        var img = document.getElementById("imageElementObj");
        img?.setAttribute("src", str);
        }
        
    )
  }


  
  enableSectionForma(disabled: any ) {
    disabled ? this.forma.enable() : this.forma.disable();
    if (this.hostingObject != null && this.forma.disabled) {
     let ho = {...this.hostingObject} ;
     ho.adress = this.forma.value.address;
     ho.name = this.forma.value.name;
     ho.phone = this.forma.value.phone;
     ho.hours = this.forma.value.hours;

      this.store.dispatch(HostingObjectActions.izmeniObjekat({ hostingObject: ho }));
    }
  }


  generateFormGroup() {
    this.forma.patchValue({
      name: this.hostingObject?.name,
      address: this.hostingObject?.adress,
      phone: this.hostingObject?.phone,
      hours: this.hostingObject?.hours
    });
  } 
   

  selektujEvent(e: myEvent) {
    if (e !== null)
    {
      this.store.dispatch(EventActions.selectEvent({ eventId :e.id }));
      }
  }

  dodavanjeFun()
  {
    this.dodavanje = !this.dodavanje;
    this.selektovanTip = "";
    this.selektovanKapacitet = null;
    this.dodajStoForma.setValue({ kapacitet: "" , tip: "" });
  }

  get tip() {
    return this.dodajStoForma.get('tip');
  }


  changeTip(tip: any)
  {

    this.tip?.setValue(tip.target.value, {
      onlySelf: true,
    });
  }
  

  dodajEvent() {
    this.dodavanjeEventa = !this.dodavanjeEventa;
    
  }

  createEvent() {
    this.dodavanjeEventa = !this.dodavanjeEventa;
    if (this.hostingObject != null) {
      
      
      const dateComponents = this.dodajEventForma.value.date;
      const timeComponents = this.dodajEventForma.value.time;


      const [year, month, day] = dateComponents.split('-');
      const [hours, minutes, seconds] = timeComponents.split(':');

      
      let newDate = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
      let strDate = formatDate(newDate, 'YYYY-MM-ddTHH:mm:ss.ss', this.locale);
      
      let imeDogadjaja = this.dodajEventForma.value.imeDogadjaja;

      let opisDogadjaja = this.dodajEventForma.value.opisDogadjaja;

      
      this.store.dispatch(EventActions.dodavanjeEventa({ hostingObjectId: this.hostingObject.id, imeDogadjaja, opisDogadjaja, datumDogadjaja: strDate }));
    }


  }

  createTable()
  {
    this.dodavanje = !this.dodavanje;
    let noviSto = new Table(-1, -1, -1, this.hostingObject);
    let noviTip = this.strToTip(this.dodajStoForma.value.tip);
    noviSto.tableCapacity = +this.dodajStoForma.value.kapacitet;
    noviSto.tableType = noviTip;
   

    this.store.dispatch(HostingObjectActions.dodajSto({ table: noviSto }));

  }

  
  strToTip(tip: string) {
    switch (tip) {
      case "Barski" : return 0 ;
      case "Separe": return 1;
      case "Niski sto": return 2;
      case "Sank": return 3;
      default: return -1;
    }
  }

}
