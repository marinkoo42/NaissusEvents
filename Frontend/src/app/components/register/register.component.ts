import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState } from 'src/app/store/app-state';
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector';
import * as KorisnikActions from 'src/app/store/korisnik/korisnik.actions';
import { User } from 'src/app/models/User';
import { AbstractControl, FormControl, FormGroup,ValidationErrors,ValidatorFn,Validators } from '@angular/forms';
import { createHasCapitalCaseValidator} from '../../validators/hasCapitalCase'
import { createHasNumberValidator} from 'src/app/validators/hasNumber';
import { createHasSmallCaseValidator} from 'src/app/validators/hasSmallCase';
import { createHasSpecialCaseValidator} from 'src/app/validators/hasSpecial';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

    public korisnici$: Observable<readonly User[]> = of([]);
    registerForm: FormGroup;
      
  
    constructor(private store: Store<AppState>, private router: Router) {
      this.registerForm = new FormGroup(
        {
          name: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]),
          lastName: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]),
          username: new FormControl('', [Validators.required,Validators.minLength(5)]),
          password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            createHasCapitalCaseValidator(),
            createHasNumberValidator(),
            createHasSmallCaseValidator(),
            createHasSpecialCaseValidator()
          ]),

          email: new FormControl('', [
            Validators.required,
            Validators.email
          ]),
          phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]\d*$/)])

        }
        )
      

    }

    ngOnInit(): void {
      this.korisnici$ = this.store.select(KorisnikSelector.selectSviKorisnici);
    }
    registracija()
    {
      if(this.registerForm.valid)
      {
        this.store.dispatch(KorisnikActions.registrovanjeNovogKorisnika({
          noviKorisnik: new User(
            "",
            this.registerForm.value.name,
            this.registerForm.value.lastName,
            this.registerForm.value.username,
            this.registerForm.value.email,
            this.registerForm.value.phone,
            this.registerForm.value.password,
            null,
            "")
        }));
        this.router.navigate(['login']);
      }
    }

  
  

    
}





