import { HostingObject } from "./HostingObject";

export class User {

    public id: string;
    public role: string;
    public name: string;
    public lastName: string;
    public userName: string;
    public password: string;
    public phone: string;
    public email: string;
    public status: string | null;
    public token: string | null;



    constructor(id: string, ime: string, prezime: string, username: string, email: string, brTelefona: string, password: string , token: string | null, role : string ) {
        this.id = id;
        this.name = ime;
        this.lastName = prezime;
        this.userName = username;
        this.password = password;
        this.phone = brTelefona;
        this.email = email;
        this.role = role ?? "korisnik";

        this.status = null;
        this.token = token;
    }

}