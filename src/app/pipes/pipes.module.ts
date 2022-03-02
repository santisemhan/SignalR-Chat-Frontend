import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LogPipe } from './helpers/log.pipe';


@NgModule({
    declarations: [
        LogPipe
    ],
    imports: [

    ],
    exports: [
        LogPipe
    ],
    providers: [],
    bootstrap: []
})
export class PipesModule { }
