"use strict";

class Api {

    /**
     * Perform the login
     */
    static doLogin = async (username, password) => {
        let response = await fetch('/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (response.ok) {
            const username = await response.json();
            return username;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.message;
            }
            catch (err) {
                throw err;
            }
        }
    }

    /**
     * Perform the signUp
     */
    static doSignUp = async (name, surname, email, password) => {
        let response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, surname, email, password }),
        });
        if (response.ok) {
            const userJson = await response.json();
            return userJson;
        } else {
            try {
                const errDetail = await response.json();
                throw errDetail.message;
            }
            catch (err) {
                throw err;
            }
        }
    }

    /**
     * Get the list of items store
     */
    static getItems = async () => {
        let response = await fetch('/api/items');
        const itemsJson = await response.json();
        if (response.ok) {
            return itemsJson;
        } else {
            throw itemsJson;  // an object with the error coming from the server
        }
    }

    /**
     * Perform the logout
     */
    static doLogout = async () => {
        await fetch('/api/sessions/current', { method: 'DELETE' });
    }

}

export default Api;