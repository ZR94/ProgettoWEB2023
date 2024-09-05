"use strict";

class Item {

    /**
     * Creates a new Item object
     * @param {number} price - the price of the item
     * @param {string} name - the name of the item
     * @param {string} category - the category of the item
     * @param {string} img - the image of the item
     */
    constructor(price, name, category, img) {
        this.price = price;
        this.name = name;
        this.category = category;
        this.img = img;
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