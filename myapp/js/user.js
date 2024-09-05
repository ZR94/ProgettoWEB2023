"use strict";

class User {

    /**
     * Construct an User
     * @param {string} name - Name of the user
     * @param {string} surname - Surname of the user
     * @param {string} email - Email address of the user
     * @param {string} password - Password of the user
     */
    constructor(name, surname, email, password) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.admin = 0;
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