import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages
import { ChatComponent } from './pages/chat/chat.component';
import { HomeComponent } from './pages/home/home.component';


export const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "chat", component: ChatComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})


export class AppRoutingModule { }
