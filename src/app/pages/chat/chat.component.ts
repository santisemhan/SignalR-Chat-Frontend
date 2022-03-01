// Angular
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

// Models
import { ChatDTO } from '../../models/persistence/chat.dto';
import { UserConnection } from '../../models/persistence/userConnection.model';

// Services
import { ChatService } from '../../_services/chat.service';

// Dialogs
import { DialogUserInfo } from '../../components/dialogs/user-info/user-info-component';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    // List
    public onlineUsers: UserConnection[]
    public messages: ChatDTO[];

    // UserData
    public connectionId: string;
    public userData: UserConnection;

    // Forms
    public messageForm: FormGroup;

    constructor(private chatService: ChatService,
        public dialog: MatDialog) { }

    /**
    * @description
    *	Se conecta al chat hub de SignalR.    
    */
    ngOnInit(): void {
        this.chatService.connectChatHub();

        this.initMessageForm();
        this.openDataUserDialog();
    }

    /**
     * @description
     *  Inicializa el formulario para que el usuario pueda enviar mensajes.
     */
    public initMessageForm(): void {
        this.messageForm = new FormGroup({
            message: new FormControl('', Validators.required)
        })
    }

    /**
     * @description
     *	Abre el dialog para que el usuario llene sus datos.
     */
    public openDataUserDialog(): void {
        const dialogRef = this.dialog.open(DialogUserInfo, {
            width: '250px',
        });

        dialogRef.afterClosed().subscribe(data => {
            this.userData = data;
            this.initChat(data);
        });
    }

    /**
     * @description
     *	Inicia el formultario del chat y conecta al usuario a la sala
     *
     * @params
     *  Usuario conectado
     */
    public initChat(userInfo: UserConnection): void {
        this.chatService.connect(userInfo);

        this.chatService.connectionId.subscribe(
            (connectionId: string) => {
                this.connectionId = connectionId
            }
        )

        this.listenMessages();
        this.listenConnectedPeople();
    }

    /**
     * @description
     *	Activa un listener de SignalR para estar al pendiente de nuevos mensajes,
     *  para luego "pushearlo" a la lista de mensajes.
     */
    public listenMessages(): void {
        this.chatService.listenMessages();

        this.chatService.messages.subscribe(
            (message: ChatDTO) => {
                console.log(message)
                this.messages.push(message)
            }
        )
    }

    /**
    * @description
    *	Activa un listener de SignalR para estar al pendiente de nuevos usuarios conectados,
    *  para luego "pushearlo" a la lista de usuarios conectados.
    */
    public listenConnectedPeople(): void {
        this.chatService.listenConnectedPeople();

        this.chatService.onlinePeople.subscribe(
            (users: any) => {
                this.onlineUsers = users
            }
        )
    }

    /**
    * @description
    *	Envia un mensaje mediante un websocket con SignalR para que lo puedan
    *   leer los usuarios conectados.
    */
    public sendMessage(): void {
        let msg = new ChatDTO();
        msg.author = this.userData.name
        msg.authorImageURL = this.userData.imageURL
        msg.message = this.messageForm.controls['message'].value

        this.chatService.sendMessage(msg)

        this.messageForm.controls['message'].setValue('')
    }

    /**
   * @description
   *  Listener de angular para estar pendiente si el usuario cierra la pestaña del
   *  navegador, para desconectar correctamente al usuario del HUB.
   */
    @HostListener('window:beforeunload')
    onClose(): void {
        this.chatService.disconnect();
    }
}
