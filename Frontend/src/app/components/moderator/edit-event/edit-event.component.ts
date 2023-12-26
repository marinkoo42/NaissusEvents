import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { myEvent } from 'src/app/models/myEvent';
import { AppState } from 'src/app/store/app-state';
import { Store } from '@ngrx/store';
import * as EventSelector from 'src/app/store/event/event.selector';
import * as EventActions from 'src/app/store/event/event.actions';
import { formatDate } from '@angular/common';
import { Reservation } from 'src/app/models/Reservation';
import { EventService } from 'src/app/services/event.service';
import { tableType } from 'src/app/models/Table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  imaSliku: boolean = false;
 
  selectedFile: File = new File([], "-1");
  ev: myEvent | null = null; 
  rezervacije: Reservation[] | null = null;
  forma = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]), 
      description: new FormControl('', [Validators.required])   
    }
  )
  constructor(private store: Store<AppState>, @Inject(LOCALE_ID) private locale: string, private eventService: EventService, private router: Router) {
    
    this.store.select(EventSelector.selectSelectedEvent).subscribe(e => {
      this.ev = e,
        this.generateFormGroup(),
        this.eventService.vratiRezervacijeEventa(this.ev?.id ?? -1).subscribe(
          rez => this.rezervacije = rez
        )
    }
    ).unsubscribe();

   }

  ngOnInit(): void {
    
    this.forma.disable();
    this.getSlike();
    
  }

  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
      console.log("FileUpload -> files", fileList[0]);

    }
  }

  dodajSliku() {
    if (this.selectedFile.name !== "-1") {
      this.imaSliku = !this.imaSliku;
      const formData = new FormData();
      console.log("Dodaj");
      formData.append("file", this.selectedFile);
      this.eventService.postSlikaEventa(this.ev?.id ?? 0, formData).then(p => this.getSlike());
    }
  }

  obrisiSliku() {
    this.imaSliku = !this.imaSliku;
    this.eventService.deleteSlikaEventa(this.ev?.id ?? 0).then(p => {

      var img = document.getElementById("imageElement");
      img?.setAttribute("src", "");

    });
    
  }

  getSlike() {
    // let slike: File[];
    this.eventService.getSlikaEventa(this.ev?.id ?? 0).then(
      resp => {

        if (resp.data.length> 0) {
          this.imaSliku = true;
        }
        const str = "data:image/jpeg;base64, " + resp.data;
        var img = document.getElementById("imageElement");
        img?.setAttribute("src", str);
      }

    )
  }
  obrisiEvent()
  {
    if (confirm('Da li zelis da obrises dogadjaj?')) {
      
      this.store.dispatch(EventActions.brisanjeEventa({ eventId: this.ev?.id ?? -1 }));
      this.router.navigate(['/moderator']);
    }
     else {
      console.log('Nista');
    }

  }

  obrisiRezervaciju(rezId:number)
  {
    this.eventService.obrisiRezervaciju(rezId).subscribe( res =>{
    this.eventService.vratiRezervacijeEventa(this.ev?.id ?? -1).subscribe(
      rez => this.rezervacije = rez
    )}).unsubscribe();
    
  }



  enableSection(disabled: any) {
    disabled ? this.forma.enable() : this.forma.disable();
    if (this.ev != null && this.forma.disabled) {
      let event = { ...this.ev };
      
      const dateComponents = this.forma.value.date;
      const timeComponents = this.forma.value.time;


      const [day, month, year] = dateComponents.split('-');
      const [hours, minutes, seconds] = timeComponents.split(':');

      let newDate = new Date(+year,+month-1,+day ,+hours,+minutes,+seconds);
      let strDate = formatDate(newDate, 'YYYY-MM-ddTHH:mm:ss.ss', this.locale);
      event.eventName = this.forma.value.name;
      event.eventDescription = this.forma.value.description;
      event.eventDate = strDate;

      this.store.dispatch(EventActions.izmeniEvent({ event: event }));
    }
  }

  generateFormGroup() {

    let date = formatDate(this.ev?.eventDate ?? new Date(), 'dd-MM-YYYY', this.locale);
    let time = formatDate(this.ev?.eventDate ?? new Date(), 'HH:mm:ss', this.locale);


    this.forma.patchValue({
      name: this.ev?.eventName,
      date: date,
      time: time,
      description: this.ev?.eventDescription
    });

  }
  
  tipToStr(tip: tableType) {
    switch (tip) {
      case 0: return "Barski";
      case 1: return "Separe";
      case 2: return "Niski sto";
      case 3: return "Sank";
      default: return "";
    }
  }

}
