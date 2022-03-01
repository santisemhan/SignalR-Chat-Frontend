// Angular
import { Injectable } from "@angular/core";

// SignalR
import { HttpTransportType, HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

// Environment
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class SignalRService {

    // SignalR
    private hubConnection: HubConnection;

    constructor() { }

    /**
     * @description
     *	Inicia la conexion con el hub pasado por parametro
     *
     * @params
     *  Nombre del hub
     * 
     * @return
     *  Hub connection
     */
    public startConnection(hub: string): HubConnection {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(environment.API_URL + hub, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect([0, 2000, 10000, 30000, null])
            .build();

        this.hubConnection
            .start()
            .then(() => {
                console.log("Connection started!");
            })
            .catch((err) => console.log("Error while starting connection: " + err));

        return this.hubConnection
    };


    /**
    * @description
    *	Inicia la conexion con el hub pasado por parametro
    *
    * @params
    *  Nombre del hub
    * 
    * @return
    *  Hub connection
    */
    public connectToHub(hub: string): HubConnection {
        return this.startConnection(hub);
    }
}
