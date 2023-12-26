import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {  metaReducers } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HostingObjectComponent } from './components/hosting-object/hosting-object.component';
import { EventComponent } from './components/event/event.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { eventReducer } from './store/event/event.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { EventEffect } from './store/event/event.effects';
import { AppState } from './store/app-state';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { korisnikReducer } from './store/korisnik/korisnik.reducer';
import { hostingObjectReducer } from './store/hostingObject/hostingObject.reducer';
import { KorisnikEffect } from './store/korisnik/korisnik.effects';
import { MatListModule } from '@angular/material/list';
import { ObjectListComponent } from './components/admin/object-list/object-list.component';
import { EventListComponent } from './components/admin/event-list/event-list.component';
import { ObjectEditComponent } from './components/admin/object-edit/object-edit.component';
import { UsersEditComponent } from './components/admin/users-edit/users-edit.component';
import { HostingObjectEffect } from './store/hostingObject/hostingObject.effects';
import { HydrationEffects } from './store/hydration/hydration.effects';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ReactiveFormsModule } from '@angular/forms';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { HostingObjectCardComponent } from './components/admin/hosting-object-card/hosting-object-card.component';
import { UserCardComponent } from './components/admin/user-card/user-card.component';
import { MatIconModule } from '@angular/material/icon';

import { ModeratorsObjectComponent } from './components/moderator/moderators-object/moderators-object.component';
import { ReservationsListComponent } from './components/moderator/reservations-list/reservations-list.component';
import { EditEventComponent } from './components/moderator/edit-event/edit-event.component';
import { EditTablesComponent } from './components/moderator/edit-tables/edit-tables.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader } from '@ngx-translate/http-loader'



export function HttpLoaderFactory(http: HttpClient) {
  
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HostingObjectComponent,
    EventComponent,
    LoginComponent,
    RegisterComponent,
    ReservationComponent,
    ObjectListComponent,
    EventListComponent,
    ObjectEditComponent,
    UsersEditComponent,
    UserprofileComponent,
    HostingObjectCardComponent,
    UserCardComponent,
    ModeratorsObjectComponent,
    ReservationsListComponent,
    EditEventComponent,
    EditTablesComponent
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // MaterialModule,
    // MatTableModule,
    // MatFormFieldModule,
    // MatInputModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    ReactiveFormsModule, 
    StoreModule.forRoot<AppState>({ eventState: eventReducer, korisnikState: korisnikReducer, hostingObjectState: hostingObjectReducer }, {metaReducers}),
    EffectsModule.forRoot([EventEffect, KorisnikEffect, HostingObjectEffect, HydrationEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true
    }),
    BrowserAnimationsModule,
    // FontAwesomeModule
  ],
  providers: [{ provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService, ModeratorsObjectComponent,
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
