// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogUserInfo } from './dialogs/user-info/user-info-component';

@NgModule({
    declarations: [
        DialogUserInfo
    ],
    imports: [
        CommonModule,
        BrowserModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [],
    exports: []
})
export class ComponentsModule { }
