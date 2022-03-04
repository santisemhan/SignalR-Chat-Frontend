// Angular
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class SoundService {

    constructor() { }

    /**
     * @description
     *	Reproduce el sonido del audio ubicado en el path
     *  ubicado en el path pasado por parametro.
     *
     * @params
     *  Path del audio
     */
    public playAudio(src: string): void {
        let audio = new Audio();
        audio.src = src;
        audio.load();
        audio.play();
    }
}
