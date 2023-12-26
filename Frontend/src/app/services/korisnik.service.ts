import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
// import { throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
import { User } from 'src/app/models/User';
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector';
import { environment } from 'src/environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Reservation } from '../models/Reservation';
import { Update } from '@ngrx/entity';
import { myEvent } from '../models/myEvent';
import { text } from '@fortawesome/fontawesome-svg-core';
import { AppState } from '../store/app-state';

export interface booleanReturn{
  retVal: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class KorisnikService {

  constructor(private httpClient: HttpClient, private router : Router, private store: Store<AppState>) { }


  setAuthorizationHeader() {
    let kor = this.getUlogovanKorisnik();
    return new HttpHeaders({
      Authorization: 'Bearer ' + kor?.token,
    });
  }

  izmeniKorisnika(korisnik: User) {
    const body = { ...korisnik };
    return this.httpClient
      .put<User>(environment.apiUrl + '/Controller/IzmeniKorisnika', body, { 
        headers: this.setAuthorizationHeader()
      }) 
      .pipe(catchError(errorHandler));
  }

  getAll() {
    return this.httpClient
      .get<User[]>(environment.apiUrl + '/Controller/VratiKorisnike', {
        headers: this.setAuthorizationHeader(),
      })
      .pipe(catchError(errorHandler));
  }


  dodajKorisnika(noviKorisnik: User) {
    return this.httpClient
      .post<User>(environment.apiUrl + '/Controller/Register', noviKorisnik)
      .pipe(catchError(errorHandler));
  }

  korisnikLogin(userName: string, password: string): Observable<string> {
    const requestOption: Object = {
      responseType: 'text'
    }
    return this.httpClient
      .post<string>(environment.apiUrl + '/Controller/Login',
        { userName: userName, password: password } ,
        requestOption
      )
      .pipe( catchError(this.loginErrorHandler) );
  }
  dodajModeratora(idKorisnika: String, idHostingObject: number){
    return this.httpClient
      .put(environment.apiUrl + '/Controller/DodajModeratora/' + idKorisnika + '/' + idHostingObject, {},
      {
        headers: this.setAuthorizationHeader(),
      })
       .pipe(catchError(errorHandler));

  }



  checkUsersToken(korisnikId: string, token: string) {
    return  this.httpClient
      .get(environment.apiUrl + '/Controller/CheckToken/' + korisnikId + '/' + token, {
        responseType: 'text'
      })

      .pipe(catchError(errorHandler));
  }

  getUlogovanKorisnik(): User {

    var kor;
    this.store.select(KorisnikSelector.selectUlogovanKorisnik).subscribe(
      k => kor = k
    );
    return kor ?? new User("-1", "", "", "", "", "", "", "", "");
  }


  obrisiKorisnika(korisnikId: string) {
    return this.httpClient
      .delete<User>(environment.apiUrl + '/Controller/ObrisiKorisnika/' + korisnikId, {
        headers: this.setAuthorizationHeader(),
      })
      .pipe(catchError(errorHandler));
  }

  vratiRezervacije(korisnikId: string)
  {
    return this.httpClient
      .get<Reservation[]>(environment.apiUrl + '/Controller/VratiRezervacijeUsera/' + korisnikId,
        {
          headers: this.setAuthorizationHeader()
        }
      ).pipe(catchError(errorHandler));
  }
  

  loginErrorHandler = (error: HttpErrorResponse) => {
      alert(error.error);
      const errorMessage =
        error.status === 0
          ? `Can't connect to API ${error.error}`
          : `Backend returned code ${error.status}`;
      if (error.status === 400) {
        this.router.navigate(['login']);
      }
     
      return throwError(errorMessage);
     
  
    };

}




const errorHandler = (error: HttpErrorResponse) => {
  alert(error.error);
  const errorMessage =
    error.status === 0
      ? `Can't connect to API ${error.error}`
      : `Backend returned code ${error.status}`;

  return throwError(errorMessage);
};