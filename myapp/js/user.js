"use strict";

class User {

    constructor(id, name, username, email, password, type) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.type = type;
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