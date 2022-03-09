// Angular
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

// Models
import { ChatDTO } from '../../models/persistence/chat.dto';
import { UserConnection } from '../../models/persistence/userConnection.model';

// Services
import { ChatHubService } from '../../_services/hub/chat.hub.service';

// Dialogs
import { DialogUserInfo } from '../../components/dialogs/user-info/user-info-component';
import { EmojiType } from '../../models/UI-enums/emojy.type';
import { SoundService } from '../../_services/sound-ui.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    // List
    public onlineUsers: UserConnection[]
    public messages: ChatDTO[] = [];

    // UserData
    public connectionId: string;
    public userData: UserConnection;

    // Forms
    public messageForm: FormGroup;

    readonly allowedFormats: string[] = ['image/jpeg', 'image/png', 'image/gif']

    constructor(private chatHubService: ChatHubService,
        public dialog: MatDialog, private soundService: SoundService) { }

    /**
    * @description
    *	Se conecta al chat hub de SignalR.    
    */
    ngOnInit(): void {
        this.chatHubService.connectChatHub()

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
            this.connectUser(data);
            this.initChat();
        });
    }

    /**
     * @description
     *	Conecta al usuario a la sala
     *
     * @params
     *  Usuario conectado
     */
    public connectUser(userInfo: UserConnection) {
        this.chatHubService.connect(userInfo);

        this.chatHubService.connectionId$.subscribe({
            next: (connectionId: string) => this.connectionId = connectionId,
            error: (error: Error) => console.log(error)
        })
    }

    /**
     * @description
     *	Inicia el formultario del chat     
     */
    public initChat(): void {
        this.listenMessages();
        this.listenConnectedPeople();
    }

    /**
     * @description
     *	Activa un listener de SignalR para estar al pendiente de nuevos mensajes,
     *  para luego "pushearlo" a la lista de mensajes.
     */
    public listenMessages(): void {
        this.chatHubService.listenMessages();

        this.chatHubService.messages$.subscribe({
            next: (message: ChatDTO) => {
                // if (message.authorId != this.connectionId) {
                //     this.soundService.playAudio("assets/sounds/notification.ogg");
                // }
                this.messages.push(message)
            },
            error: (error: Error) => console.log(error)
        })
    }

    /**
    * @description
    *	Activa un listener de SignalR para estar al pendiente de nuevos usuarios conectados,
    *  para luego "pushearlo" a la lista de usuarios conectados.
    */
    public listenConnectedPeople(): void {
        this.chatHubService.listenConnectedPeople();

        this.chatHubService.onlinePeople$.subscribe({
            next: (users: UserConnection[]) => {
                this.onlineUsers = users
            },
            error: (error: Error) => console.log(error)
        })
    }

    /**
    * @description
    *	Envia un mensaje mediante un websocket con SignalR para que lo puedan
    *   leer los usuarios conectados.
    */
    public sendMessage(): void {
        if (this.messageForm.invalid) {
            return;
        }

        let msg = new ChatDTO();
        msg.author = this.userData.name
        msg.authorImageURL = this.userData.imageURL
        msg.dateTime = new Date();
        msg.message = this.messageForm.controls['message'].value

        this.chatHubService.sendMessage(msg)

        this.messageForm.controls['message'].setValue('')
    }


    /**
    * @description
    *	Envia un emoji mediante un websocket con SignalR para que lo puedan
    *   leer los usuarios conectados.
    */
    public sendEmoji(emoji: EmojiType): void {
        let msg = new ChatDTO();
        msg.author = this.userData.name
        msg.authorImageURL = this.userData.imageURL
        msg.dateTime = new Date();
        msg.imageURL = this.getEmojiImage(emoji)

        this.chatHubService.sendMessage(msg)
    }

    /**
    * @description
    *	Retorna el path en el cual el emoji se encuentra alojado
    */
    private getEmojiImage(emoji: EmojiType): string {
        switch (emoji) {
            case EmojiType.Like:
                return "https://assets.wprock.fr/emoji/joypixels/512/1f44d.png";
            case EmojiType.HappyFace:
                return "https://iconarchive.com/download/i108215/google/noto-emoji-smileys/10002-beaming-face-with-smiling-eyes.ico";
            default:
                return undefined;
        }
    }

    /**
     * @description
     * Envia una imagen mediante un websocket con SignalR para que lo puedan
     *   leer los usuarios conectados.
     */
    public sendImage(file: File): void {
        if (this.allowedFormats.some(af => af === file.type)) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                let msg = new ChatDTO();
                msg.author = this.userData.name
                msg.authorImageURL = this.userData.imageURL
                msg.dateTime = new Date();
                msg.imageURL = reader.result as string;

                this.chatHubService.sendMessage(msg)
            };
        } else {
            // TODO: Warning in UI
            alert("No allowed format")
        }
    }

    /**
   * @description
   *  Listener de angular para estar pendiente si el usuario cierra la pestaña del
   *  navegador, para desconectar correctamente al usuario del HUB.
   */
    @HostListener('window:beforeunload')
    onClose(): void {
        this.chatHubService.disconnect();
    }
}
