import { AsyncPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { AppState } from '../store/app-state';
import * as KorisnikSelector from '../store/korisnik/korisnik.selector'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  korisnik: User | null = null;
  constructor(private store: Store<AppState>, private router: Router) { 
    this.store.select(KorisnikSelector.selectUlogovanKorisnik).subscribe(
      (usr) => this.korisnik = usr 
    )
   }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    
    if (this.korisnik?.id === "-1") {
      alert("Morate biti ulogovani");
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
  
}
