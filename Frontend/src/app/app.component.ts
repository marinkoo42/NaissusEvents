import { Component, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from './models/User';
import { Store } from '@ngrx/store';
import { KorisnikService } from 'src/app/services/korisnik.service'
import * as KorisnikSelector from 'src/app/store/korisnik/korisnik.selector'
import * as KorisnikActions from 'src/app/store/korisnik/korisnik.actions'
import { AppState } from './store/app-state';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core'
import { MetaReducer } from "@ngrx/store";
import { hydrationMetaReducer } from "./store/hydration/hydration.reducer";
import { JwtHelperService } from '@auth0/angular-jwt';

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'Frontend';

  profilNav: string | null = null;
  profilRoute: string | null = null;


  currentKorisnik: User | null = null;
  korisnici: User | null = null;
  currentSubscription: Subscription | null = null;
  currentLokalSubscription: Subscription | null = null;


  izlogujButton: boolean | null = null;
  loginButton: boolean | null = null;


  constructor(private korisnikService: KorisnikService, private store: Store<AppState>, private router: Router
    , private jwtHelper: JwtHelperService, private translateService: TranslateService) {
   
    
      this.profilRoute = "register";
      this.profilNav = "Registracija";
      this.loginButton = true;
      let korisnik: User = new User("-1", "", "", "", "", "", "", "", "");
      this.currentSubscription = this.store.select(KorisnikSelector.selectUlogovanToken).subscribe(
      (token) => {
        if (token !== "") {
          let kor;
          try {
            const decode = this.jwtHelper.decodeToken(token);
            let str;
            const newObj = {} as any;
            for (let prop in decode) {
              const val = decode[prop];
              if (prop.includes('/')) {
                str = prop.substring(prop.lastIndexOf('/') + 1, prop.length);
              }
              else {
                str = prop;
              }
              newObj[str] = val;
            }
            kor = newObj;
           
          }
          catch (error) {
            console.log(error);
          }
          korisnik = new User(kor.userId, kor.name ?? "", kor.surname ?? "", kor.userName, kor.emailaddress, kor.homephone, "", token, kor.role);
          this.loguj(korisnik);
    
        }


      }
    );

   
   }

  ngOnInit() {
    this.translateService.setDefaultLang('sr');
    this.translateService.use(localStorage.getItem('lang') || 'sr');
    

   
  }



  loguj(korisnik: User ) {
    if (korisnik === null) {
      this.profilRoute = "register";
      this.izlogujButton = null;
      this.profilNav = "Registracija";
      this.loginButton = true;
    }

    else if (korisnik.name === "" && korisnik.lastName === "") {
      this.profilRoute = "register";
      this.izlogujButton = null;
      this.profilNav = "Registracija";
      this.loginButton = true;

    }
    else {
      this.loginButton = null;
      if (korisnik.role === "Admin") {
        
        this.currentKorisnik = korisnik;
        this.profilRoute = "admin";
        this.izlogujButton = true;
        this.profilNav = "Admin alati";
      }
      else if (korisnik.role === "Moderator") {
        this.currentKorisnik = korisnik;
        this.profilRoute = "moderator";
        this.izlogujButton = true;
        this.profilNav = "Moderator alati";
      }
      else if (korisnik.name !== "" && korisnik.lastName !== "") {
        this.profilRoute = "userProfile";
        this.currentKorisnik = korisnik;
        this.izlogujButton = true;
        this.profilNav = korisnik.name;
      }
      this.store.dispatch(KorisnikActions.citajToken({ korisnik :korisnik }))
     
      
    }



  }



     izloguj() {
    this.store.select(KorisnikSelector.selectUlogovanKorisnik).subscribe(kor => {

      let korisnik = kor;
      if (korisnik.id !== "-1" && korisnik.token !== "")
        this.store.dispatch(KorisnikActions.izlogujKorisnika());
      let k = new User("-1", "", "", "", "", "", "", "", "");
      this.loguj(k);
      
      this.router.navigate(['/home']);
      
    }).unsubscribe();
    
  }

  postaviSrpski() {
    localStorage.setItem('lang', 'sr');
    window.location.reload();
    
  }

  postaviEngleski() {
    localStorage.setItem('lang', 'en');
    window.location.reload();

  }


}
