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
    static doSignUp = async (user) => {
        let response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
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
     * Perform the logout
     */
    static doLogout = async () => {
        await fetch('/api/sessions/current', { method: 'DELETE' });
    }

    /**
     * Delete a user by their ID
     * @param {string} userId - The ID of the user to delete
     * @returns {Promise<void>} - A promise that resolves when the user is deleted or rejects with an error
     * @throws {Error} - If there is an error deleting the user
     */
    static deleteUser = async (userId) => {
        try {
            // Send a DELETE request to the API to delete the user
            let response = await fetch(`/api/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // If the response is successful,
            if (response.ok) {
                const result = await response.json();
                return result;
            }
            // If the response is not successful, throw an error
            else {
                const errorData = await response.json();
                throw errorData;
            }
        }
        // If there is an error sending the request or parsing the response, alert the user and reject the promise
        catch (error) {
            throw error;
        }
    }

    /**
     * Fetches all users from the API.
     * @returns {Promise<Array>} - A promise that resolves to an array of user objects.
     * @throws {Error} - If there is an error fetching the users, this promise will reject with an error object.
     */
    static getUsers = async () => {
        // Send a GET request to the API to fetch all users
        let response = await fetch('/api/users');

        // Parse the response as JSON
        const usersJson = await response.json();

        // If the response is successful, return the users
        if (response.ok) {
            return usersJson;
        }
        // If the response is not successful, throw an error with the error message from the server
        else {
            throw usersJson;  // an object with the error coming from the server
        }
    }

    /**
     * Fetches a user from the API by their user ID.
     * @param {string} userId - The ID of the user to fetch.
     * @returns {Promise<Object>} - A promise that resolves to a user object.
     * @throws {Error} - If there is an error fetching the user, this promise will reject with an error object.
     */
    static getLoggedUser = async (userId) => {
        // Send a GET request to the API to fetch the user with the specified ID
        let response = await fetch(`/api/user/${userId}`);

        // Parse the response as JSON
        const userJson = await response.json();

        // If the response is successful, return the user
        if (response.ok) {
            return userJson;
        }
        // If the response is not successful, throw an error with the error message from the server
        else {
            throw userJson;  // an object with the error coming from the server
        }
    }

    static addUserInfo = async (userId, dataInfo) => {
        try {
            let response = await fetch(`/api/user/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dataInfo }),
            });
            if (response.ok) {
                const responseData = await response.json();
                return responseData;
            } else {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'An error occurred while adding the information.');
            }
        } catch (err) {
            throw new Error(err.message || 'Network error');
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

    static addItem = async (item) => {
        try {
            let response = await fetch('/api/item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ item }),
            });

            if (response.ok) {
                const responseData = await response.json();
                return responseData;
            } else {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'An error occurred while adding the item.');
            }
        } catch (err) {
            throw new Error(err.message || 'Network error');
        }
    }

    static removeItem = async (id) => {
        const response = await fetch(`/api/item/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            const errDetail = await response.json();
            throw new Error(errDetail.message || 'An error occurred while adding the item.');
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

    static getWishlistByUser = async (userId) => {
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

    static getWishlistByVisibility = async (userId, visibility) => {
        try {
            let response = await fetch(`/api/wishlist/${userId}/${visibility}`);

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

    static addItemWishlist = async (userId, item, visibility) => {
        try {
            const response = await fetch(`/api/user/${userId}/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ item, visibility }),
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

    static removeItemFromWishlist = async (userId, itemId) => {
        const response = await fetch(`/api/user/${userId}/wishlist/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errDetail = await response.json();
            throw new Error(errDetail.message || 'Unknown error');
        }

        return response;
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

    static addComment = async (comment) => {
        try {
            let response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment }),
            });

            if (response.ok) {
                const responseData = await response.json();
                return responseData;
            } else {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'An error occurred while adding the comment.');
            }
        } catch (err) {
            throw new Error(err.message || 'Network error');
        }
    }

    static removeComment = async (commentId) => {

        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errDetail = await response.json();
            throw new Error(errDetail.message || 'Unknown error');
        }

        const responseData = await response.json();
        return responseData;

    }

    static updateComment = async (text, idComment) => {
        let response = await fetch(`/api/comments/${idComment}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });
        try {
            if (!response.ok) {
                const errDetail = await response.json();
                throw new Error(errDetail.message);
            }

            const responseData = await response.json();
            return responseData;
        } catch (err) {
            throw new Error(`Errore durante l'aggiornamento del commento: ${err.message}`);
        }
    }

    static getCommentsbyUserId = async (userId) => {
        let response = await fetch(`/api/search/user/${userId}/comments`);
        const commentsJson = await response.json();
        if (response.ok) {
            return commentsJson;
        } else {
            throw commentsJson;  // an object with the error coming from the server
        }
    }

    static getCommentsbyItemId = async (itemId) => {
        let response = await fetch(`/api/search/items/${itemId}/comments`);
        const commentsJson = await response.json();
        if (response.ok) {
            return commentsJson;
        } else {
            throw commentsJson;  // an object with the error coming from the server
        }
    }

    static getCommentsbyUserIdandItemId = async (userId, itemId) => {
        let response = await fetch(`/api/search/user/${userId}/items/${itemId}/comments`);
        const commentsJson = await response.json();
        if (response.ok) {
            return commentsJson;
        } else {
            throw commentsJson;  // an object with the error coming from the server
        }
    }

    static getCommentsbyKeyword = async (keyword) => {
        try {
            let response = await fetch(`/api/search/comments/${keyword}`);
            if (response.ok) {
                const commentsJson = await response.json();
                return commentsJson;
            } else {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'No comments found containing the keyword.');
            }
        } catch (error) {
            throw new Error(err.message || 'Network error');
        }
    }

    static getHistoryPurchase = async (userId) => {
        let response = await fetch(`/api/user/${userId}/history`);
        const historyJson = await response.json();
        if (response.ok) {
            return historyJson;
        } else {
            throw historyJson;  // an object with the error coming from the server
        }
    }

    static getSearchByCategoryAndPrice = async (category, priceMin, priceMax) => {
        let response = await fetch(`/api/search/${category}/${priceMin}/${priceMax}`);
        const itemsJson = await response.json();
        if (response.ok) {
            return itemsJson;
        } else {
            throw itemsJson;  // an object with the error coming from the server
        }
    }

}

export default Api;