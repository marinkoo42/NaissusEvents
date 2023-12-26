import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import * as KorisnikSelector from '../store/korisnik/korisnik.selector'
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { AppState } from '../store/app-state';

@Injectable({
  providedIn: 'root'
})
export class ModGuardGuard implements CanActivate {
  korisnik: User | null = null;
  constructor(private store: Store<AppState>, private router: Router) {
    this.store.select(KorisnikSelector.selectUlogovanKorisnik).subscribe(
      (usr) => this.korisnik = usr
    ).unsubscribe();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.korisnik?.role !== "Moderator" ) {
      alert("Unauthorized!");
      if (this.korisnik?.role === "Admin")
        this.router.navigate(['/admin']);
      else
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }

  
}
