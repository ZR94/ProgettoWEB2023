"use strict";

class Purchase {

    constructor(idUser, idItem, qta, price) {
        this.idUser = idUser;
        this.idItem = idItem;
        this.qta = qta;
        this.price = price;
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