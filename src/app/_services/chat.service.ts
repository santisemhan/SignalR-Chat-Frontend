// Angular
import { EventEmitter, Injectable } from "@angular/core";

// SignalR
import { HubConnection } from "@microsoft/signalr";

//Models
import { ChatDTO } from "../models/persistence/chat.dto";
import { UserConnection } from "../models/persistence/userConnection.model";

// Services
import { SignalRService } from "./signalr.service";


@Injectable({
    providedIn: "root"
})
// Hacer interface para SignalR
export class ChatService {

    // SignalR
    public connection: HubConnection;

    // Emiters
    public messages = new EventEmitter<ChatDTO>();
    public onlinePeople = new EventEmitter<UserConnection[]>();
    public connectionId = new EventEmitter<string>();

    constructor(private signalRService: SignalRService) { }

    /**
     * @description
     *  Se conecta al hub 'chat'
     */
    public connectChatHub(): void {
        this.connection = this.signalRService.connectToHub("chat");
        this.listenConnectionId()
    }

    /**
     * @description
     *  Corta la conexion con el hub 'chat'
     */
    public disconnectChatHub(): void {
        this.connection.stop();
    }

    /**
     * @description
     *  Enviar via websocket la informacion del usuario logueado para
     *  avisar de una nueva conexion a los usuarios en el chat. 
     * 
     * @param
     *  Usuario a conectar
     */
    public connect(info: UserConnection): void {
        this.connection.send("Connect", info)
    }

    /**
     * @description
     *  Enviar via websocket la informacion del usuario logueado para
     *  avisar de una nueva desconexion a los usuarios en el chat. 
     */
    public disconnect(): void {
        this.connection.send("Disconnect")
    }

    /**
     * @description
     *  Envia via websocket un mensaje para que lo puedan leer los usuarios
     *  conectados en el chat. 
     * 
     * @param
     *   Mensaje a enviar
     */
    public sendMessage(parameters: ChatDTO): void {
        this.connection.send("SendMessage", parameters)
            .then(res => console.log("Message send!"))
            .catch(error => console.log("Error al enviar el mensaje!"))
    }

    /**
     * @description
     *  Listener para obtener el id de la conexion con el websocket.
     */
    public listenConnectionId() {
        this.connection.on(
            "ReciveConnectionId", (connectionId: string) => {
                this.connectionId.emit(connectionId)
            }
        )
    }

    /**
     * @description
     *  Listener para obtener la lista de usuarios conectados.
     */
    public listenConnectedPeople(): void {
        this.connection.on(
            "ReciveConnectedUsers", (users: any) => {
                this.onlinePeople.emit(users);
            }
        )
    }

    /**
     * @description
     *  Listener para obtener nuevos mensajes. 
     */
    public listenMessages(): void {
        this.connection.on(
            "ReceiveMessage", (message: ChatDTO) => {
                this.messages.emit(message);
            }
        )
    }

}
