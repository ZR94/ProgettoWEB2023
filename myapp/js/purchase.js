"use strict";

class Purchase {

    /**
     * Creates a new Purchase object
     * @param {number} idUser - The ID of the user who made the purchase
     * @param {number} idItem - The ID of the item purchased
     * @param {number} qta - The quantity of items purchased
     * @param {number} price - The price of the purchased items
     * @param {string} dateTime - The date and time of the purchase
     */
    constructor(idUser, idItem, qta, price, dateTime) {
        this.idUser = idUser;
        this.idItem = idItem;
        this.qta = qta;
        this.price = price;
        this.dateTime = dateTime;
    }

    /**
     * Construct an Purchasname from a plain object
     * @param {*} json 
     * @return {Purchase} the newly created Item object
     */
    static from(json) {
        const e = Object.assign(new Purchase(), json);
        return e;
    }
}

export default Purchase;