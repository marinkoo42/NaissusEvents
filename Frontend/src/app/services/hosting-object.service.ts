import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HostingObject } from '../models/HostingObject';
import { myEvent } from '../models/myEvent';
import { Table } from '../models/Table';
import { AppState } from '../store/app-state';
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector';
import { User } from '../models/User';
import axios from 'axios';
import { AxiosInstance } from "axios";



@Injectable({
  providedIn: "root"
})
export class ApiClient {

  public axiosClient: AxiosInstance;

  constructor() {

  
    this.axiosClient = axios.create({
      timeout: 3000,
      headers: {
        "X-Initialized-At": Date.now().toString()
      }
    });

  }
}

@Injectable({
  providedIn: 'root'
})
export class HostingObjectService {

  constructor(private httpClient: HttpClient, private store: Store<AppState>, private apiClient:ApiClient) { }


  getAll() {
    return this.httpClient
      .get<HostingObject[]>(environment.apiUrl + '/Controller/VratiKafice', {
        headers: this.setAuthorizationHeader()
      })
      .pipe(catchError(errorHandler));
  }

  izmeniObjekat(objekat: HostingObject | null) {
    const body = { ...objekat };
    return this.httpClient
      .put<HostingObject>(environment.apiUrl + '/Controller/IzmeniKafic', body, {
        headers: this.setAuthorizationHeader()
      }) 
      .pipe(catchError(errorHandler));
  }

  dodajObjekat(objekat: HostingObject) {
    const body = { ...objekat };
    return this.httpClient
      .post<HostingObject>(environment.apiUrl + '/Controller/DodajKafic', body, {
        headers: this.setAuthorizationHeader()
      } ) 
      .pipe(catchError(errorHandler));
  }

  dodajSto(table: Table) {
    const body = { ...table };
    return this.httpClient
      .post<Table>(environment.apiUrl + '/Controller/DodajSto',body,  {
        headers: this.setAuthorizationHeader()
      })
      .pipe(catchError(errorHandler));
  }

  setAuthorizationHeader() {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.getUlogovanKorisnik().token,
    });
  }


  getHostingObjectOfModerator(moderatorId: string)
  {
    return this.httpClient
      .get<HostingObject>(environment.apiUrl + '/Controller/VratiKaficModeratora/' + moderatorId, {
        headers: this.setAuthorizationHeader()
      })
      .pipe(catchError(errorHandler));
  }

  dodajSlikuObjekta(id:number, formfile:FormData) {
    console.log("Servis");
    return this.apiClient.axiosClient
      .post(environment.apiUrl + '/Controller/PostPictureHostingObject/' + id, formfile)
  }

  deleteSlikuObjekta(id: number) {
    console.log("Servis");
    return this.apiClient.axiosClient
      .delete(environment.apiUrl + '/Controller/DeletePictureHostingObject/' + id)
  }


  getSlikaObjekta(id: number) {
    // console.log("Servis");
    return this.apiClient.axiosClient
      .get(environment.apiUrl + '/Controller/GetPictureHostingObject/' + id, {
        responseType: 'text'
      })
  }

 

  getTablesOfHostingObject(hostingObjectId: number)
  {
    return this.httpClient
      .get<Table[]>(environment.apiUrl + '/Controller/VratiStoloveObjekta/' + hostingObjectId, {
        headers: this.setAuthorizationHeader()
      })
      .pipe(catchError(errorHandler)); 
  }

  getUlogovanKorisnik() {

    var kor;
    this.store.select(KorisnikSelector.selectUlogovanKorisnik).subscribe(
      k => kor = k
    );
    return kor ?? new User("-1", "", "", "", "", "", "", "token","");
  }


  removeModerator(hostingObjectId: number) {
    console.log(this.setAuthorizationHeader());
    return this.httpClient
      .put(environment.apiUrl + '/Controller/ObrisiModeratora/' + hostingObjectId,{}
        , {
        headers: this.setAuthorizationHeader()
      }) 
      .pipe(catchError(errorHandler));
  }


  obrisiObjekat(hostingObjectId: number) {
    return this.httpClient
      .delete<HostingObject>(environment.apiUrl + '/Controller/ObrisiObjekat/' + hostingObjectId, {
        headers: this.setAuthorizationHeader(),
      })
      .pipe(catchError(errorHandler));
  }
  
  obrisiSto(tableId: number) {
    return this.httpClient
      .delete<number>(environment.apiUrl + '/Controller/ObrisiSto/' + tableId, {
        headers: this.setAuthorizationHeader(),
      })
      .pipe(catchError(errorHandler));
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
