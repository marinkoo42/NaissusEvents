import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { myEvent } from '../models/myEvent';
import { Table, tableType } from '../models/Table';
import { AppState } from 'src/app/store/app-state';
import * as EventSelector from 'src/app/store/event/event.selector'
import { Reservation } from '../models/Reservation';
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector';
import { User } from '../models/User';
import { ApiClient } from './hosting-object.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private id: number | undefined = undefined;

  constructor(private httpClient: HttpClient, private store: Store<AppState>, private apiClient: ApiClient) {
    this.store.select(EventSelector.selectSelectedEvent).subscribe(
      (event) => this.id = event?.id
    );
  }


  getAll() {
    return this.httpClient
      .get<myEvent[]>(environment.apiUrl + '/Controller/VratiEvente'
      
    )
      .pipe(catchError(errorHandler));
  }


  vratiRezervacijeEventa(eventId: number)
  {
    return this.httpClient
      .get<Reservation[]>(environment.apiUrl + '/Controller/VratiRezervacijeEventa/' + eventId, {
          headers: this.setAuthorizationHeader(),
        }
      )
      .pipe(catchError(errorHandler));

  }

  izmeniEvent(event: myEvent) {
    const body = { ...event };
    return this.httpClient
      .put<myEvent>(environment.apiUrl + '/Controller/IzmeniEvent', body, {
        headers: this.setAuthorizationHeader()
      }) 
      .pipe(catchError(errorHandler));
  }

  

  dodajRezervaciju(eventId: number, userId: string, tableType: tableType , tableCapacity: number) {
    
    return this.httpClient
      .post(environment.apiUrl + '/Controller/DodajRezervaciju/' + eventId + '/' + userId + '/' + tableType + '/' + tableCapacity, {},
        {
          headers: this.setAuthorizationHeader(),
          responseType: 'text'
        },
        )
      .pipe(catchError(errorHandler));
  }

  dodajEvent(objekatId: number, imeDogadjaja: string, opisDogadjaja:string, datumDogadjaja: string){

    return this.httpClient
      .post<myEvent>(environment.apiUrl + '/Controller/DodajEventZaObjekat/' + objekatId + '/' + imeDogadjaja + '/' + opisDogadjaja + '/' + datumDogadjaja, {},
        {
          headers: this.setAuthorizationHeader()
        },
      )
      .pipe(catchError(errorHandler));
  }

  getNerezervisaniStolovi() {
    return this.httpClient.get<Table[]>(environment.apiUrl + '/Controller/VratiNerezervisaneStoloveObjekta/' + this.id)
  }

 

  getUlogovanKorisnik() {
    var kor;
    this.store.select(KorisnikSelector.selectUlogovanKorisnik).subscribe(
      k => kor = k);
      return kor ?? new User("-1", "", "", "", "", "", "", "", "");
  }
  postSlikaEventa(id:number, formfile:FormData) {
    return this.apiClient.axiosClient
      .post(environment.apiUrl + '/Controller/PostPictureEvent/' + id, formfile)

  }
  deleteSlikaEventa(id: number) {
    return this.apiClient.axiosClient
      .delete(environment.apiUrl + '/Controller/DeletePictureEvent/' + id)
  }



  getSlikaEventa(id: number) {
    return this.apiClient.axiosClient
      .get(environment.apiUrl + '/Controller/GetPictureEvent/' + id, {
        responseType: 'text'
      })
  }

  obrisiRezervaciju(rezervacijaId: number){
    return this.httpClient
      .delete(environment.apiUrl + '/Controller/ObrisiRezervaciju/' + rezervacijaId, {
        responseType: 'text',
        headers: this.setAuthorizationHeader()
      }
     )
      
      .pipe(catchError(errorHandler));
  }

  obrisiEvent(eventId:number)
  {
    return this.httpClient
      .delete<number>(environment.apiUrl + '/Controller/ObrisiEvent/' + eventId,
        {
          headers: this.setAuthorizationHeader()
        }
    )
  }


  setAuthorizationHeader() {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.getUlogovanKorisnik().token,

    });
  }

}

const errorHandler = (error: HttpErrorResponse) => {
  alert(error.error);
  const errorMessage =
    error.status === 0
      ? `Can't connect to API ${error.error}`
      : `Backend returned code ${error.status}`;

  return throwError(errorMessage);
};
