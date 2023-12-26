import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/User';
import { KorisnikService } from 'src/app/services/korisnik.service';
import * as KorisnikActions from 'src/app/store/korisnik/korisnik.actions'
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector'
import { AppState } from 'src/app/store/app-state';
import { Observable, of } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { createHasCapitalCaseValidator } from 'src/app/validators/hasCapitalCase';
import { createHasNumberValidator } from 'src/app/validators/hasNumber';
import { createHasSmallCaseValidator } from 'src/app/validators/hasSmallCase';
import { createHasSpecialCaseValidator } from 'src/app/validators/hasSpecial';
import { Router } from '@angular/router';
import { korisnikReducer } from 'src/app/store/korisnik/korisnik.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  //korisnici$: Observable<User[]> = of([]);
  ulogovani$: User | null = null;
  profilRoute: string = '';
  
  loginForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        createHasCapitalCaseValidator(),
        createHasNumberValidator(),
        createHasSmallCaseValidator(),
        createHasSpecialCaseValidator()
      ]),
    }
  )
  constructor(private store: Store<AppState>, private router: Router) { }

  ngOnInit(): void {
  }

  logIn()
  {
    if (this.loginForm.valid)
    {
        this.store.dispatch(KorisnikActions.logovanjeKorisnika({ userName: this.loginForm.value.username, password: this.loginForm.value.password }));
        // this.router.navigate(['']); 
      this.store.select(KorisnikSelector.selectUlogovanKorisnik).subscribe(
        korisnik => {
          // console.log(korisnik);
          if (korisnik.id !== "-1" && korisnik.role !== "Admin" && korisnik.role !== "Moderator") {
            this.router.navigate(['/home']);
          }
          else if (korisnik.role === "Moderator")
            this.router.navigate(['/moderator']);
          else if (korisnik.role === "Admin")
            this.router.navigate(['/admin']);
        }
      )
    } 
    
  }
}
