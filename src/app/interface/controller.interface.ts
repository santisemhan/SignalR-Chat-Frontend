
/**
 * @description
 *  Interface que representa un controlador REST.
 */

export interface Controller {

    /**
     * @description
     *  Devuelve el subpath base del controlador asociado. Este path no debe
     *  incluir el host del servidor.
     */
    basePath(): string;
}
