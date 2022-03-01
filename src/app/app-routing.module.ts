// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages
import { ChatComponent } from './pages/chat/chat.component';



export const routes: Routes = [
    {
        path: '**',
        component: ChatComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})


export class AppRoutingModule { }
