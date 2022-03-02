import { Pipe, PipeTransform } from "@angular/core";

/**
 * @description
 *	Se utliza para hacer un console.log() dentro del HTML, {{parametro del console log | log}}
 */

@Pipe({ name: "log", pure: true })
export class LogPipe implements PipeTransform {
    /**
     * @description
     *	Se utliza para hacer un console.log() dentro del HTML, {{parametro del console log | log}}
     *
     * @param value
     *	Lo que quieras mostrar en consola
     *
     * @returns
     *	Retorna null pero en la consola se podrá observar lo que hayas pasado por parametro
     */
    transform(value: any, args?: any): any {
        console.log(value);
        return null;
    }
}

