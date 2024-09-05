"use strict";

class Comment {
    
    /**
     * Creates a new Comment object
     * @param {string} idUser the ID of the user who created the comment
     * @param {string} idItem the ID of the item that the comment refers to
     * @param {string} text the text of the comment
     */
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