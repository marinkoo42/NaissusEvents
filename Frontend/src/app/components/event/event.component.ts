import { formatDate } from '@angular/common';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { myEvent } from 'src/app/models/myEvent';
import { EventService } from 'src/app/services/event.service';
import { AppState } from 'src/app/store/app-state';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  @Input() ev: myEvent | null = null;
  @Output() onClick: EventEmitter<myEvent> = new EventEmitter<myEvent>();
  // events$: Observable<myEvent[]> = of([]);
  // ho$: Observable<any> =of([]);
  // // events$: any=[];//Observable<myEvent[]> = of([]);
  // // eventi: myEvent[] = [];
  // hostObj1: HostingObject | null = null;
   


  constructor(private store: Store<AppState>, private eventService: EventService,@Inject(LOCALE_ID) private locale: string) {
    // if (this.ev !== null)
      // this.getSlike();
    
    
   }

  ngOnInit(): void {
        this.getSlike(); 
  };
  
  
  
  getSlike() {
    // let slike: File[];
    this.eventService.getSlikaEventa(this.ev?.id ?? 0).then(
      resp => {

        const str = "data:image/jpeg;base64, " + resp.data;
        // var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(resp.data)));
        let elId = "imageElement" + this.ev?.id;
        var img = document.getElementById(elId);
        img?.setAttribute("src", str);
      }

    )
  }
  formatDate(datum : string)
  {
    return formatDate(datum, 'dd-MM-yyyy HH:mm', this.locale);
  }
  

  clicked()
  {
    if (this.ev)
      this.onClick.emit(this.ev);
  }


}
