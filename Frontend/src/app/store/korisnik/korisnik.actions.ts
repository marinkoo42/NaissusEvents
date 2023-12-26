import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { User } from "src/app/models/User";




export const registrovanjeNovogKorisnika = createAction(
    "Registrovanje novog korisnika",
    props<{
        noviKorisnik: User
    }>()
)

export const uspesnoRegistrovanjeNovogKorisnika = createAction(
    "Uspesna registracija novog korisnika"   
)
export const ucitavanjeKorisnika = createAction(
    "Ucitavanje korisnika iz baze"
)

export const uspesnoUcitavanjeKorisnika = createAction(
    "Uspesno ucitani korisnici iz baze",
    props<{
        korisnici: User[]
    }>()
)

export const citajToken = createAction(
    "citanje tokena",
    props<{
        korisnik: User
    }>()
)

//postavlja korisnika u Store
export const uspesnoLogovanje = createAction(
    "Uspesno logovanje korisnika {vracen Token}",
    props<{
        token: string
    }>()
)
export const logovanjeKorisnika = createAction(
    "Logovanje korisnika",
    props<{
        userName:string, password:string
    }>()
)




// export const izlogujKorisnika = createAction(
//     "LogingOut...",
//     props<{
//         korisnikId:string, token:string
//     }>()
// )

export const izlogujKorisnika = createAction(
    "Uspesno izlogovan korisnik"
)

export const brisiKorisnika = createAction(
    "Brisanje korisnika",
    props<{
        korisnikId: string
    }>()
)
export const uspesnoBrisanjeKorisnika = createAction(
    "Uspesno brisanje korisnika iz baze"
)

export const selectUser = createAction(
    "Selektovan korisnik",
    props<{
        selektovanKorisnikId: string
    }>()
)

export const izmeniKorisnika = createAction(
    "izmeni korisnika",
    props<{
        korisnik: User
    }>()
)

export const izmeniKorisnikaSuccess = createAction(
    "Uspesna izmena korisnika",
        props < {
            korisnik: User //Partial<User>
    }>
    ()
)

export const dodajModeratora = createAction(
    "Dodavanje moderatora",
    props<{
        idKorisnika:string, idHostingObject:number
    }>()
)
export const dodavanjeModeratoraSuccess = createAction(
    "Uspesno dodavanje moderatora"
)

export const izmeniUlogovanogKorisnika = createAction(
    "izmeni ulogovanog korisnika",
    props<{
        korisnik: User
    }>()
)

export const izmeniUlogovanogKorisnikaSuccess = createAction(
    "Uspesna izmena ulogovanog korisnika",
    props<{
        korisnik: User
    }>
        ()
)