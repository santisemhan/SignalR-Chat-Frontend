// Angular
import { Injectable, EventEmitter } from "@angular/core";

// Interfaces
import { Controller } from "../interface/controller.interface";

// Models
import { ChatDTO } from "../models/chat.dto";

// Environment
import { environment } from "../../environments/environment";

// Services
import { SignalRService } from "./signalr.service";

// SignalR
import { HubConnection } from "@microsoft/signalr";

@Injectable({
    providedIn: "root"
})
export class ChatService implements Controller {

    public connection: HubConnection;
    public messages = new EventEmitter<ChatDTO>();

    constructor(private signalRService: SignalRService) { }

    public basePath(): string {
        return "api/chat"
    }

    // Antes de realizar cualquier operacion con SignalR se debe haber ejecutado este metodo. 
    public connectChatHub(): void {
        this.connection = this.signalRService.connectToHub("chat");
    }

    public disconnectChatHub() {
        this.connection.stop();
    }

    public sendMessage(parameters: ChatDTO): void {
        this.connection.send("SendMessage", parameters)
            .then(res => console.log("Message send!"))
            .catch(error => console.log("Error al enviar el mensaje!"))
    }

    public listenMessages(): void {
        this.connection.on(
            "ReceiveMessage", (message: ChatDTO) => {
                this.messages.emit(message);
            }
        )
    }

}
