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
    public listenConnectionId(): Observable<string> {
        return this._hub.listen<string>("ReciveConnectionId")
    }

    /**
     * @description
     *  Listener para obtener la lista de usuarios conectados.
     */
    public listenConnectedPeople(): Observable<UserConnection[]> {
        return this._hub.listen<UserConnection[]>("ReciveConnectedUsers")
    }

    /**
     * @description
     *  Listener para obtener nuevos mensajes. 
     */
    public listenMessages(): Observable<ChatDTO> {
        return this._hub.listen<ChatDTO>("ReceiveMessage")
    }
}
