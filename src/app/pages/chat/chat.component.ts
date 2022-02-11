// Angular
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { onlinePeopleMock } from '../../mocks/online-people.mock';
import { ChatDTO } from '../../models/chat.dto';
import { ChatService } from '../../_services/chat.service';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    public messages: ChatDTO[] = [];
    public messageForm: FormGroup;

    // Mocks
    public onlineUsers = onlinePeopleMock;

    constructor(
        private chatService: ChatService
    ) { }

    ngOnInit(): void {
        this.chatService.connectChatHub();
        this.listenMessages();
        this.initMessageForm();
    }

    public listenMessages() {
        this.chatService.listenMessages();

        this.chatService.messages.subscribe(
            (message: ChatDTO) => {
                this.messages.push(message)
            }
        )
    }

    public sendMessage(): void {
        let test = new ChatDTO();
        test.author = this.messageForm.controls['author'].value;
        test.message = this.messageForm.controls['message'].value;

        this.chatService.sendMessage(test)
    }

    public initMessageForm(): void {
        this.messageForm = new FormGroup({
            author: new FormControl('', Validators.required),
            message: new FormControl('', Validators.required)
        })
    }

    // TODO: CHANGE
    public changeSelectedUser(id: number) {
        let i = this.onlineUsers.findIndex(u => u.id == id)

        this.onlineUsers.forEach(u => u.current = false);

        this.onlineUsers[i].current = true;
    }

    public getCurrentUser() {
        return this.onlineUsers.find(user => user.current == true)
    }

}
