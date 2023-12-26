import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/User';
import { AppState } from 'src/app/store/app-state';
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector'
import * as KorisnikActions from 'src/app/store/korisnik/korisnik.actions'

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {


  korisnik: User | null = null;

  forma = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required])


    }
  )
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {

    this.store.select(KorisnikSelector.selectSelektovanKorisnik).subscribe(k =>
      this.korisnik = k);
    this.generateFormGroup();
    this.forma.disable();
  }


  enableSection(disabled: any) {
    disabled ? this.forma.enable() : this.forma.disable();
    if (this.korisnik != null && this.forma.disabled) {
      let kor = { ...this.korisnik };
      kor.name = this.forma.value.name;
      kor.lastName = this.forma.value.lastname;
      kor.userName = this.forma.value.username;
      kor.phone = this.forma.value.phone;
      kor.email = this.forma.value.email;

      
      this.store.dispatch(KorisnikActions.izmeniKorisnika({ korisnik: kor }));
    }
  }

  private generateFormGroup() {
    this.forma.patchValue({
      name: this.korisnik?.name,
      lastname: this.korisnik?.lastName,
      username: this.korisnik?.userName,
      phone: this.korisnik?.phone,
      email: this.korisnik?.email
    });
  }

}


