// Angular
import { Injectable } from "@angular/core";
import { from, Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

// SignalR
import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

// Environment
import { environment } from "../../../environments/environment";

export class Hub {

    private _hubConnection: HubConnection

    constructor() {
    }

    /**
    * @description
    *	Getter de lal HubConnection
    *
    * @return
    *   Hub connection
    */
    public getConnection(): HubConnection {
        return this._hubConnection;
    }

    /**
    * @description
    *	Verifica si la conexión esta activa
    *
    * @return
    *   Boolean para determina si esta conectado
    */
    public isConnected(): boolean {
        return this._hubConnection.state == HubConnectionState.Connected ||
            this._hubConnection.state == HubConnectionState.Connecting ||
            this._hubConnection.state == HubConnectionState.Reconnecting
    }

    /**
    * @description
    *	Inicia la conexion por WebSocket con SignalR a un hub
    *
    * @params
    *  Nombre del hub
    * 
    * @return
    *  Observable del build de la conexion con el hub
    */
    public connect(hubName: string): Observable<void> {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl(environment.API_URL + hubName, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect([0, 2000, 10000, 30000, null])
            .build();

        return from(this._hubConnection.start())
            .pipe(
                catchError((error: Error) => throwError("Error trying connect user to the Hub"))
            )
    }

    /**
     * @description
     *	Corta la conexion por WebSocket con SignalR a un hub
     *
     * @return
     *  Observable de la desconexion del hub
     */
    public disconnect(): Observable<void> {
        if (!this.isConnected()) {
            throwError("The user was already disconnected from the hub")
        }
        return from(this._hubConnection.stop())
            .pipe(
                catchError(error => throwError("Error trying disconnect user from the Hub"))
            );
    }

    /**
     * @description
     *	Llama por WebSocket al metodo del hub pasado por parametro. 
     *
     * @return
     *  Observable del envio de datos por webSocket
     */
    public send(method: string, param: any = undefined): Observable<void> {

        if (!this.isConnected()) {
            throwError("The connection must be active")
        }
        if (param) {
            return from(this._hubConnection.send(method, param))
                .pipe(
                    catchError(error => throwError(`Error sending mesage to method ${method} param: ${param}`))
                )
        }
        return from(this._hubConnection.send(method))
            .pipe(
                catchError(error => throwError(`Error sending mesage to method ${method} param: ${param}`))
            )
    }
}