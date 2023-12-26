
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, tap } from 'rxjs';
import { myEvent } from 'src/app/models/myEvent';
import { AppState } from 'src/app/store/app-state';
import { ucitajEvente } from 'src/app/store/event/event.actions';
import * as EventSelector from 'src/app/store/event/event.selector'
import * as EventActions from 'src/app/store/event/event.actions'
import { HostingObject } from 'src/app/models/HostingObject';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  ev: Observable<myEvent | null> = of(null);

  events$: Observable<myEvent[]> = of([]);
  hostingObject: HostingObject | undefined = undefined;


  constructor(private store: Store<AppState>) { 
    this.store.dispatch(ucitajEvente());
    this.events$ = this.store.select(EventSelector.selectAllEvents);

  }
  ngOnInit(): void {


  }

  selectedEvent(ev: myEvent)
  {

    this.store.dispatch(EventActions.selectEvent({ eventId: ev.id }))
    this.ev = this.store.select(EventSelector.selectSelectedEvent);
    this.hostingObject = ev.hostingObject;

  }

}
