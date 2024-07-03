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

    static getWishlist = async (userId) => {
        try {
            let response = await fetch(`/api/wishlist/${userId}`);
            const wishlistJson = await response.json();

            if (response.ok) {
                return wishlistJson;
            } else {
                throw wishlistJson;  // Un oggetto con l'errore proveniente dal server
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            throw error;  // Rilancia l'errore per essere gestito dal chiamante
        }
    }

    /*
    static getItemVisibility = async (userId, visibility) => {
        try {
            let response = await fetch(`/api/user/${userId}/wishlist/${visibility}`);
            const wishlistJson = await response.json();

            if (response.ok) {
                return wishlistJson;
            } else {
                throw wishlistJson;  // Un oggetto con l'errore proveniente dal server
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            throw error;  // Rilancia l'errore per essere gestito dal chiamante
        }
    }
    */

    static getFilterItems = async (categoryName) => {
        try {
            let response = await fetch(`/api/items/categories/${categoryName}`);
            const itemsJson = await response.json();

            if (response.ok) {
                return itemsJson;
            } else {
                throw itemsJson;  // Un oggetto con l'errore proveniente dal server
            }
        } catch (error) {
            console.error('Error fetching Items:', error);
            throw error;  // Rilancia l'errore per essere gestito dal chiamante
        }
    }

    static getFilterTitle = async (categoryName) => {
        try {
            let response = await fetch(`/api/items/titles/${categoryName}`);
            const itemsJson = await response.json();

            if (response.ok) {
                return itemsJson;
            } else {
                throw itemsJson;  // Un oggetto con l'errore proveniente dal server
            }
        } catch (error) {
            console.error('Error fetching Items:', error);
            throw error;  // Rilancia l'errore per essere gestito dal chiamante
        }
    }

    static addItemWishlist = async (userId, item) => {
        try {
            const response = await fetch(`/api/user/${userId}/wishlist`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( item ),
            });
            
            if (response.ok) {
                const responseData = await response.json();
                return responseData;
            } else {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'An error occurred while adding the item to the wishlist.');
            }
        } catch (err) {
            throw new Error(err.message || 'Network error');
        }
    }

    static removeItemFromWishlist = async (userId, item) => {
        const response = await fetch(`/api/user/${userId}/wishlist/${item.id}`, {
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


    /**
     * Get the list of categories
    */
    static getCategories = async () => {
        let response = await fetch('/api/categories');
        const categoriesJson = await response.json();
        if (response.ok) {
            return categoriesJson;
        } else {
            throw categoriesJson;  // an object with the error coming from the server
        }
    }

    static doCheckout = async (listPurchase) => {
        let response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ listPurchase }),
        });
        if (response.ok) {
            const res = await response.json();
            return res;
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

}

export default Api;