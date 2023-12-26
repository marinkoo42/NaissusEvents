import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app-state';
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector';
import * as KorisnikActions from 'src/app/store/korisnik/korisnik.actions';
import { Reservation } from 'src/app/models/Reservation';
import { Observable, of } from 'rxjs';
import { KorisnikService } from 'src/app/services/korisnik.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { formatDate } from '@angular/common';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  korisnik: User | null = null;
  postojeRezervacije: boolean = false;
  rezervacije$: Observable<Reservation[]> = of([]);
  forma = new FormGroup(
    {
      name: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]),
      lastName: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]\d*$/)]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ])
      
      
    })
  constructor(private store: Store<AppState>, private korisnikService: KorisnikService, @Inject(LOCALE_ID) private locale: string, private appKomponent :AppComponent,private eventService:EventService) { }

  ngOnInit(): void {
      this.store.select(KorisnikSelector.selectUlogovanKorisnik).subscribe(
        ulogovanKorisnik=>{
          this.korisnik = ulogovanKorisnik
          this.generateFormGroup();
          this.forma.disable();
        }
      )
    
    this.rezervacije$ = this.korisnikService.vratiRezervacije(this.korisnik?.id ?? "");
    this.rezervacije$.subscribe(res => {
      if (res.length > 0) {
        this.postojeRezervacije = true;
      }
      else {
        this.postojeRezervacije = false;
      }
    })

  }


  enableSection(disabled: any) {
    disabled ? this.forma.enable() : this.forma.disable();
    if (this.korisnik != null && this.forma.disabled) {
      if(confirm("Da li zelis da izmenis podatke? Bices izlogovan!")){

        let kor = { ...this.korisnik };
        kor.name = this.forma.value.name;
        kor.lastName = this.forma.value.lastName;
        kor.phone = this.forma.value.phone;
        kor.email = this.forma.value.email;
        
        this.store.dispatch(KorisnikActions.izmeniUlogovanogKorisnika({ korisnik: kor }));
        this.appKomponent.izloguj();
       
      }
      else {
        this.generateFormGroup();
      }
      
    }
  }

  deleteReservation(res : Reservation) {
    this.eventService.obrisiRezervaciju(res.id).subscribe(res => {
      this.rezervacije$ = this.korisnikService.vratiRezervacije(this.korisnik?.id ?? "-1");
    })
  }

  funEditSave() {
    if (this.forma.disabled) {
      return "edit"
    }
      else return "save"
   
 }
  formatDate(datum: string | undefined) {
    return formatDate(datum ?? "", 'dd-MM-yyyy HH:mm', this.locale);
  }

  obrisiRezervaciju() {
    if (confirm("Da li zelite da obrisete rezervaciju?")) {
      
    }
  }

  generateFormGroup() {
    this.forma.patchValue({
      name: this.korisnik?.name,
      lastName: this.korisnik?.lastName,
      phone: this.korisnik?.phone,
      email: this.korisnik?.email
    });
  }

}
