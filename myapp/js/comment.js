"use strict";

class Comment {
    
    constructor(idUser, idItem, text) {
        this.idUser = idUser;
        this.idItem = idItem;
        this.text = text;
    }

    /**
     * Prende un oggetto in formato json e lo trasforma in un oggetto js
     * @param json
     * @returns {any}
     */
    static from(json) {
        const e = Object.assign(new Comment(), json);
        return e;
    }
}
export default Comment;