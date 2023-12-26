import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, of } from 'rxjs';
import { User } from '../models/User';
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector'
import { AppState } from '../store/app-state';
import { booleanReturn, KorisnikService } from '../services/korisnik.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  korisnik: User | null = null;
  token: string = "";
  private isValidToken: string = "";
  private roleOk: boolean = false;

  constructor(private store: Store<AppState>, private router: Router, private korisnikService: KorisnikService, private jwtHelper: JwtHelperService) {

    
    
    
    this.store.select(KorisnikSelector.selectUlogovanToken).subscribe(
      tok => this.token = tok
    );
    

    this.store.select(KorisnikSelector.selectUlogovanKorisnik).subscribe(
      kor => {
        this.korisnik = kor;
      });
  }


    canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) : boolean
    {

      if (this.korisnik?.role !== "Admin") {
        alert("Unauthorized!");
        // return false;
        if (this.korisnik?.role === "Moderator") {
          this.router.navigate(['/moderator']);
          return false;
        }
        else {
          this.router.navigate(['/home']);
          return false;
        }
      }
     return true;
    
    }
    
  }
