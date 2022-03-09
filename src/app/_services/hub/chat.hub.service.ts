// Angular
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

// SignalR
import { Hub } from "../../models/helpers/hub.model";

//Models
import { ChatDTO } from "../../models/persistence/chat.dto";
import { UserConnection } from "../../models/persistence/userConnection.model";


@Injectable({
    providedIn: "root"
})
// Hacer interface para SignalR
export class ChatHubService {

    // SignalR
    public _hub: Hub = new Hub();

    // Emiters
    public messages$: Subject<ChatDTO> = new Subject<ChatDTO>();
    public onlinePeople$: Subject<UserConnection[]> = new Subject<UserConnection[]>();
    public connectionId$: Subject<string> = new Subject<string>();

    constructor() { }

    /**
     * @description
     *  Se conecta al hub 'chat'
     */
    public connectChatHub(): Observable<void> {
        return this._hub.connect("chat")
    }

    /**
     * @description
     *  Corta la conexion con el hub 'chat'
     */
    public disconnectChatHub(): Observable<void> {
        return this._hub.disconnect();
    }

    /**
     * @description
     *  Enviar via websocket la informacion del usuario logueado para
     *  avisar de una nueva conexion a los usuarios en el chat. 
     * 
     * @param
     *  Usuario a conectar
     */
    public connect(info: UserConnection): Observable<void> {
        this.listenConnectionId();
        return this._hub.send("Connect", info);
    }

    /**
     * @description
     *  Enviar via websocket la informacion del usuario logueado para
     *  avisar de una nueva desconexion a los usuarios en el chat. 
     */
    public disconnect(): Observable<void> {
        return this._hub.send("Disconnect");
    }

    /**
     * @description
     *  Envia via websocket un mensaje para que lo puedan leer los usuarios
     *  conectados en el chat. 
     * 
     * @param
     *   Mensaje a enviar
     */
    public sendMessage(parameters: ChatDTO): Observable<void> {
        return this._hub.send("SendMessage", parameters)
    }

    /**
    * @description
    *  Listener para obtener el id de la conexion con el websocket.
    */
    public listenConnectionId() {
        this._hub.getConnection().on(
            "ReciveConnectionId", (connectionId: string) => {
                this.connectionId$.next(connectionId)
            }
        )
    }

    /**
     * @description
     *  Listener para obtener la lista de usuarios conectados.
     */
    public listenConnectedPeople(): void {
        this._hub.getConnection().on(
            "ReciveConnectedUsers", (users: UserConnection[]) => {
                this.onlinePeople$.next(users);
            }
        )
    }

    /**
     * @description
     *  Listener para obtener nuevos mensajes. 
     */
    public listenMessages(): void {
        this._hub.getConnection().on(
            "ReceiveMessage", (message: ChatDTO) => {
                this.messages$.next(message);
            }
        )
    }
}
