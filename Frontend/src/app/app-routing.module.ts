import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObjectEditComponent } from './components/admin/object-edit/object-edit.component';
import { ObjectListComponent } from './components/admin/object-list/object-list.component';
import { UsersEditComponent } from './components/admin/users-edit/users-edit.component';
import { HomeComponent } from './components/home/home.component';
import { HostingObjectComponent } from './components/hosting-object/hosting-object.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { UserCardComponent } from './components/admin/user-card/user-card.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { AuthGuard } from './guards/auth.guard';
import { ModGuardGuard } from './guards/mod-guard.guard';
import { ModeratorsObjectComponent } from './components/moderator/moderators-object/moderators-object.component';
import { AdminGuard } from './guards/admin.guard';
import { EditEventComponent } from './components/moderator/edit-event/edit-event.component';
import { EditTablesComponent } from './components/moderator/edit-tables/edit-tables.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'admin/user-edit', component: UsersEditComponent,
    canActivate: [AuthGuard,AdminGuard]
  },
  { path: 'hostingObject/:id', component: HostingObjectComponent },
  { path: 'login', component: LoginComponent },
  { path: 'hostingObject/:id/rezervacija/:eventId', component: ReservationComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin', component: ObjectListComponent,
    canActivate: [AuthGuard,AdminGuard]
  },

  { path: 'userProfile', component: UserprofileComponent },
  {
    path: 'admin/objectEdit/:id', component: ObjectEditComponent,
    canActivate: [AuthGuard,AdminGuard]
  },
  {
    path: 'admin/user-edit/user/:id', component: UserCardComponent,
    canActivate: [AuthGuard,AdminGuard]
  },
  {
    path: 'moderator', component: ModeratorsObjectComponent,
    canActivate: [AuthGuard,ModGuardGuard]
  },
  {
    path: 'moderator/event-edit/:id', component: EditEventComponent,
    canActivate: [AuthGuard, ModGuardGuard]
  },
  {
    path: 'moderator/edit-tables/:id',component: EditTablesComponent,
    canActivate:[AuthGuard,ModGuardGuard]
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
