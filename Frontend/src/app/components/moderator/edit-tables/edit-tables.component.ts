import { Component, Input, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import { AppState } from 'src/app/store/app-state';
import { Table, tableType } from 'src/app/models/Table';
import { HostingObject } from 'src/app/models/HostingObject';
import * as HostingObjectSelector from 'src/app/store/hostingObject/hostingObject.selector';
import { ModeratorsObjectComponent } from '../moderators-object/moderators-object.component';
import { HostingObjectService } from 'src/app/services/hosting-object.service';
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector';
import * as HostingObjectActions from 'src/app/store/hostingObject/hostingObject.actions';


@Component({
  selector: 'app-edit-tables',
  templateUrl: './edit-tables.component.html',
  styleUrls: ['./edit-tables.component.css']
})

export class EditTablesComponent implements OnInit {
  
  tables: Table[] | null = null;
  hostingObject: HostingObject | null = null;
  
  constructor( private hoService: HostingObjectService, private store: Store<AppState>) { }

   
  
  ngOnInit(): void {
    let mod;
    this.store.select(KorisnikSelector.selectUlogovanKorisnik).subscribe(kor => {
      mod = kor;
      if (mod !== null) {
        this.hoService.getHostingObjectOfModerator(mod.id).subscribe(o => {
          this.hostingObject = o,
            this.store.dispatch(HostingObjectActions.ucitajStoloveModeratora({ hostingObjectId: o.id }));
       
       
        })
       
      }
    }).unsubscribe();
    this.store.select(HostingObjectSelector.selectModeratorTables).subscribe(
      tables => this.tables = tables
    );
      } 

  obrisi(table: Table)
  {
    this.store.dispatch(HostingObjectActions.obrisiSto({ tableId: table.id }));
    
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