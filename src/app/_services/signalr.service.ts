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

    private hubConnection: HubConnection;

    constructor() { }

    public startConnection(hub: string) {
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


    public connectToHub(hub: string): HubConnection {
        return this.startConnection(hub);
    }
}
