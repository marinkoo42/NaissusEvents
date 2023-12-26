import { createAction, props } from "@ngrx/store"
import { HostingObject } from "src/app/models/HostingObject"
import { Table } from "src/app/models/Table"





export const ucitajObjekte = createAction(
    "Ucitavanje objekata iz baze"
)

export const loadObjectsSuccess = createAction(
    "Uspesno ucitavanje objekata iz baze",
    props<{ objekti: HostingObject[] }>()
)




export const selectHostingObject = createAction(
    "Selektovan hostingObject",
    props<{
        hostingObjectId: number
    }>()
    )
    
    export const izmeniObjekat = createAction(
        "izmeni hostingObject",
        props<{
            hostingObject: HostingObject
        }>()
)
        
    export const izmeniObjekatSuccess = createAction(
            "Uspesna izmena objekata"
        )

    export const DodajObjekat = createAction(
            "dodaj hostingObject",
            props<{
                hostingObject: HostingObject
            }>()
    )
            
    export const DodavanjeObjekataSuccess = createAction(
                "Uspesno kreiranje objekata",
                props<{
                    hostingObject: HostingObject
                }>()
            )
    export const removeModerator = createAction(
        "remove moderator for hostingObject",
        props<{
            hostingObjectId: number
        }>()
        )
    export const removeModeratorSuccess = createAction(
        "Uspesno brisanje moderatora"
    
    )
    export const obrisiObjekat = createAction(
        "brisanje hostingObject-a",
        props<{
            hostingObjectId: number
        }>()
        )
    export const obrisiObjekatSuccess = createAction(
        "Uspesno brisanje objekta"
    
    )
    export const obrisiSto = createAction(
        "brisanje stola",
        props<{
            tableId: number
        }>()
        )
    export const obrisiStoSuccess = createAction(
        "Uspesno brisanje stola"
        ,
        props<{
            hostingObjectId: number
        }>()
    
    )
    export const dodajSto = createAction(
        "dodavanje stola",
        props<{
            table: Table
        }>()
        )
    export const dodajStoSuccess = createAction(
        "Uspesno dodavanje stola"
    
    )
    
    export const ucitajStoloveModeratora = createAction(
        "ucitavnje stolova",
        props<{
            hostingObjectId: number
        }>()
    )
    export const ucitajStoloveModeratoraSuccess = createAction(
         "Uspesno ucitavanje stolova"
         ,
        props<{
            stolovi:Table[]
        }>()

    )



  



