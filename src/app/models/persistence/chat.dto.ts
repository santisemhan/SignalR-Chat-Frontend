export class ChatDTO {

    /**
    * @description
    *  Conexion del usuario al webSocket.
    */
    authorId: string

    /**
     * @description
     *  Nombre del usuario logueado.
     */
    author: string

    /**
    * @description
    *  Imagen de perfil del usuario logueado.
    */
    authorImageURL: string

    /**
    * @description
    *  Mensaje a enviar.
    */
    message: string

    /**
     * @description
     *  Imagen a enviar.
     */
    imageURL: string

    /**
    * @description
    *  fecha y horario del mensaje enviado.
    */
    dateTime: Date

}