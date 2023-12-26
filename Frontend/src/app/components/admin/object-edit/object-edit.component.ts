import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/store/app-state';
import { Store } from '@ngrx/store';
import { HostingObject } from 'src/app/models/HostingObject';
import * as HostingObjectSelector from 'src/app/store/hostingObject/hostingObject.selector';
import * as HostingObjectActions from 'src/app/store/hostingObject/hostingObject.actions';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HostingObjectService } from 'src/app/services/hosting-object.service';
import { User } from 'src/app/models/User';
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector';
import * as KorisnikActions from 'src/app/store/korisnik/korisnik.actions';
import { Observable, startWith, withLatestFrom, map, of } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-object-edit',
  templateUrl: './object-edit.component.html',
  styleUrls: ['./object-edit.component.css']
})
export class ObjectEditComponent implements OnInit {

  hostingObject: HostingObject | null = null;
  korisnici$: Observable<User[]> = of([]);
  filtriraniKorisnici$: Observable<User[]> | undefined;
  formGroup: FormGroup;
  forma = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      hours: new FormControl('', [Validators.required]), 
      phone: new FormControl('', [Validators.required]) 
      
      
    }
  )

  constructor(private store: Store<AppState>, private formBuilder: FormBuilder,private router:Router)
  { 
    this.store.select(HostingObjectSelector.selectSelectedHostingObject).subscribe(
      objekat => {
        this.hostingObject = objekat;
        this.generateFormGroup();
        this.forma.disable();
      }
    );

    this.formGroup = this.formBuilder.group({ filter: [''] });
    this.store.select(KorisnikSelector.selectPotencijalniModeratori).subscribe(
      objekti => {
        this.korisnici$ = of(objekti);
        let kor = this.korisnici$;
        
        this.filtriraniKorisnici$ = this.formGroup.get('filter')?.valueChanges.pipe(
          startWith(''),
          withLatestFrom(kor),
          map(([val, korisnici]) =>
          !val ? korisnici : korisnici.filter((x) => x.userName.toLowerCase().includes(val))
          ));
        });

}

  ngOnInit(): void {
  }

  enableSection(disabled: any) {
    
    disabled ? this.forma.enable() : this.forma.disable();
    if (this.hostingObject != null && this.forma.disabled) {
      let ho = { ...this.hostingObject };
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


  obrisiModeratora() {
    if (confirm('Da li zelis da obrises moderatora?')) {

      this.store.dispatch(HostingObjectActions.removeModerator({ hostingObjectId: this.hostingObject?.id ?? -1 }));
      
    } else {
      console.log('Nista');
    }

    
  }

  dodajModeratora(moderator: User) {
    this.store.dispatch(KorisnikActions.dodajModeratora({ idKorisnika: moderator.id, idHostingObject: this.hostingObject?.id ?? -1}))

  }

  obrisiObjekat() {
    if (confirm('Da li zelis da obrises objekat?')) {
      
      this.store.dispatch(HostingObjectActions.obrisiObjekat({ hostingObjectId: this.hostingObject?.id ?? -1 }));
      this.store.dispatch(HostingObjectActions.ucitajObjekte());
      this.router.navigate(['/admin']);
    } else {
      console.log('Nista');
    }
  }

}
