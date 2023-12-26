import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/models/User';
import { AppState } from 'src/app/store/app-state';
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector';
import * as KorisnikActions from 'src/app/store/korisnik/korisnik.actions';
import { myEvent } from 'src/app/models/myEvent';



@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.css']
})
export class UsersEditComponent implements OnInit {

  public korisnici$: User[] = [];

  constructor(private store : Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(KorisnikActions.ucitavanjeKorisnika());
    this.store.select(KorisnikSelector.selectSviBezAdmina).subscribe(
      objekti => {
        this.korisnici$ = objekti;
      })
  }




  izmeni(korisnik:User) 
  {
    
    this.store.dispatch(KorisnikActions.selectUser({ selektovanKorisnikId : korisnik.id }));
  }
  obrisi(korisnik: User) 
  {
    if (confirm('Da li zelis da obrises korisnika?')) {
      this.store.dispatch(KorisnikActions.brisiKorisnika({korisnikId: korisnik.id}));
    } else {
      console.log('Nista');
    }
  }

 

}
