"use strict";

class User {

    constructor(name, surname, email, password) {
        this.name = name;
        this.username = surname;
        this.email = email;
        this.password = password;
    }

    /**
     * Construct an User from a plain object
     * @param {*} json 
     * @return {User} the newly created Item object
     */
    static from(json) {
        const e = Object.assign(new User(), json);
        return e;
    }
}

export default User;