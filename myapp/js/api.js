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

    static getItemById = async (itemId) => {
        let response = await fetch(`/api/items/${itemId}`);
        if (response.ok) {
            const itemsJson = await response.json();
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

    static getLoggedUser = async (userId) => {
        let response = await fetch(`/api/user/${userId}`);   
        if (response.ok) {
            const userJson = await response.json();
            return userJson;
        } else {
            throw userJson;  // an object with the error coming from the server
        }
    }

    static createWishlist = async(userId) => {
        let response = await fetch(`/wishlist/${userId}`);
        const whishlistJson = await response.json();
        if (response.ok) {
            return whishlistJson;
        } else {
            throw whishlistJson;  // an object with the error coming from the server
        }
    }

    static addItemWishlist = async (userId, item) => {
        const response = await fetch(`/user/${userId}/wishlist`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        if(response.ok) {
            resolve(null);
        } else {
            response.json()
            .then( (obj) => {reject(obj);} ) 
            .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); 
              }
    }

    async dltItemFromWishList(userId, item) {
        const response = await fetch(`/user/${userId}/item/${item.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, item }),
        });
        if (!response.ok) {
            try {
                const errDetail = await response.json();
                throw errDetail.message;
            }
            catch (err) {
                throw err;
            }
        }
    }

}

export default Api;