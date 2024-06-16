"use strict";

class Item {

    constructor(id, price, name, img, category) {
        this.id = id;
        this.price = price;
        this.name = name;
        this.img = img;
        this.category = category;
    }

    /**
     * Construct an Item from a plain object
     * @param {*} json 
     * @return {Item} the newly created Item object
     */
    static from(json) {
        const e = Object.assign(new Item(), json);
        return e;
    }
}

export default Item;