import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { HostingObject } from 'src/app/models/HostingObject';
import { AppState } from 'src/app/store/app-state';
import * as HostingObjectSelector from 'src/app/store/hostingObject/hostingObject.selector';
import * as HostingObjectActions from 'src/app/store/hostingObject/hostingObject.actions';
import * as KorisnikActions from 'src/app/store/korisnik/korisnik.actions'
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-object-list',
  templateUrl: './object-list.component.html',
  styleUrls: ['./object-list.component.css']
})
export class ObjectListComponent implements OnInit {

  hostingObjects$: HostingObject[] = [];
  dodavanje: boolean = false;

  objectListForm = new FormGroup({

    name: new FormControl('',[Validators.required]),
    address: new FormControl(''),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]\d*$/)]),
    hours: new FormControl('')
  })
  

  constructor(private store : Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(HostingObjectActions.ucitajObjekte());
    this.store.dispatch(KorisnikActions.ucitavanjeKorisnika());
    this.store.select(HostingObjectSelector.selectAllHostingObjects).subscribe(
      objekti => this.hostingObjects$ = objekti
    );
  }

  selectedHostingObject(ho: HostingObject) {

    this.store.dispatch(HostingObjectActions.selectHostingObject({ hostingObjectId: ho.id }))
    
  }

  dodavanjeFun()
  {
    this.dodavanje = !this.dodavanje;
    this.objectListForm.setValue({name : "", address: "", phone: "", hours: ""});
  }

  createObject()
  {
    let noviHst= new HostingObject(-1,"","","","",0,"",0,0,[],null);
    noviHst.adress=this.objectListForm.value.address;
    noviHst.name=this.objectListForm.value.name;
    noviHst.phone=this.objectListForm.value.phone;
    noviHst.hours=this.objectListForm.value.hours;
    this.store.dispatch(HostingObjectActions.DodajObjekat({ hostingObject: noviHst }));
  }

 
}
