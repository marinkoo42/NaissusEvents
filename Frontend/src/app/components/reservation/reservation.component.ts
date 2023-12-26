import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, of } from 'rxjs';
import { myEvent } from 'src/app/models/myEvent';
import { HostingObject } from 'src/app/models/HostingObject';
import { Table, tableType } from 'src/app/models/Table';
import { EventService } from 'src/app/services/event.service';
import { AppState } from 'src/app/store/app-state';
import * as EventSelector from 'src/app/store/event/event.selector';
import { formatDate } from '@angular/common';
import { User } from 'src/app/models/User';
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector'
import * as EventActions from 'src/app/store/event/event.actions'
import { Reservation } from 'src/app/models/Reservation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  ev: myEvent | null = null;
  hostingObject: HostingObject | undefined = undefined;
  ulogovanKorisnik: User | null = null;
  tables: Observable<Table[]> = of([]);
  stolovi: Table[] = new Array<Table>();
  listaTipova: tableType[] = [];
  listaBrojMesta: number[] = [];
  selektovanTip: tableType | null = null;
  selektovanBrojMesta: number =-1;
  constructor(private store: Store<AppState>, private eventService: EventService, @Inject(LOCALE_ID) private locale: string, private router: Router) { }

  ngOnInit(): void {

    this.store.select(KorisnikSelector.selectUlogovanKorisnik).subscribe(
      (korisnik) => this.ulogovanKorisnik = korisnik
    );

    this.store.select(EventSelector.selectSelectedEvent).subscribe(
      (event) => this.ev = event
    );

    this.hostingObject = this.ev?.hostingObject;
    this.tables.subscribe(tables => this.stolovi = tables);
    this.tables = this.eventService.getNerezervisaniStolovi();
    this.tables.subscribe((data) => {
      data.forEach(table => this.stolovi.push(table)), 
        this.stolovi.forEach((element) => {
          if (!this.listaTipova.includes(element.tableType)) {
            this.listaTipova.push(element.tableType);
          }
        }); });
    
  }

  rezervisi()
  {
    console.log(this.ulogovanKorisnik);
    if (this.selektovanTip == null || this.selektovanBrojMesta == -1)
    {
      alert("Popunite sva polja!");
      return;
    }
    if (this.ulogovanKorisnik?.id === "-1")
    {
      alert("Morate biti ulogovani");
      this.router.navigate(['/login']);
      return;
    }
    this.store.dispatch(EventActions.dodavanjeRezervacije(
      {
        eventId: this.ev?.id ?? -1,
        userId: this.ulogovanKorisnik?.id ?? "-1",
        tableType: this.selektovanTip ?? -1,
        tableCapacity: this.selektovanBrojMesta
      }))
    var str = "/hostingObject/".concat(this.hostingObject?.id.toString() ?? "");
    
    this.router.navigateByUrl(str);
    
  }

  formatDate(datum : string)
  {
    return formatDate(datum, 'dd-MM-yyyy', this.locale);
  }

  izabranBrojMesta(brojMesta: number)
  {
    this.selektovanBrojMesta = brojMesta;
  }

  izabranTipStola(tip: tableType)
  { 
    if (this.listaBrojMesta.length != 0)
      this.listaBrojMesta = [];
    this.selektovanTip = tip;
    this.stolovi.forEach((sto) => {
      if (sto.tableType === tip)
      {
        if (!this.listaBrojMesta.includes(sto.tableCapacity))
          this.listaBrojMesta.push(sto.tableCapacity);  
      }
    })
  }

  tipToStr(tip:tableType)
  {
    switch (tip) {
      case 0: return "Barski";
      case 1: return "Separe";
      case 2: return "Niski sto";
      case 3: return "Sank";
      default: return "";
    }

  }

}

