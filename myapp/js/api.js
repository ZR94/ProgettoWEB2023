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
                if (errDetail.errors) {
                    throw errDetail.errors;
                } else {
                    throw new Error(errDetail.message);
                }
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

    //------------- USER ------------

    /**
     * Delete a user by their ID
     * @param {string} userId - The ID of the user to delete
     * @returns {Promise<void>} - A promise that resolves when the user is deleted or rejects with an error
     * @throws {Error} - If there is an error deleting the user
     */
    static deleteUser = async (userId) => {
        try {
            let response = await fetch(`/api/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                const errorData = await response.json();
                throw errorData;
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Fetches all users from the API.
     * @returns {Promise<Array>} - A promise that resolves to an array of user objects.
     * @throws {Error} - If there is an error fetching the users, this promise will reject with an error object.
     */
    static getUsers = async () => {
        let response = await fetch('/api/users');

        try {
            if (!response.ok) {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'Error while getting the users');
            }

            const usersJson = await response.json();
            return usersJson;

        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    }

    /**
     * Fetches a user from the API by their user ID.
     * @param {string} userId - The ID of the user to fetch.
     * @returns {Promise<Object>} - A promise that resolves to a user object.
     * @throws {Error} - If there is an error fetching the user, this promise will reject with an error object.
     */
    static getLoggedUser = async (userId) => {
        let response = await fetch(`/api/user/${userId}`);

        try {
            if (!response.ok) {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'Error while getting the logged user');
            }

            const usersJson = await response.json();
            return usersJson;

        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    }

    /**
     * Add user information to a user with the specified ID.
     * @param {string} userId - The ID of the user to add information to.
     * @param {Object} dataInfo - The information to add to the user.
     * @returns {Promise<Object>} - A promise that resolves to the updated user object.
     * @throws {Error} - If there is an error adding the information, this promise will reject with an error object.
     */
    static addUserInfo = async (userId, dataInfo) => {

        let response = await fetch(`/api/user/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dataInfo }),
        });
        try {
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

    //------------- PURCHASE ------------

    /**
     * Fetches the history of purchases made by the user with the given ID from the server.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<Object[]>} - A promise that resolves to an array of purchase objects.
     * @throws {Object} - If there is an error during the fetch, this promise will reject with an error object.
     */
    static getHistoryPurchase = async (userId) => {
        let response = await fetch(`/api/user/${userId}/history`);

        try {
            if (!response.ok) {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'Error while removing the item from the wishlist');
            }

            const historyJson = await response.json();
            return historyJson;

        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    }

    /**
     * Perform a checkout with the given list of purchases.
     * @param {Object[]} listPurchase - The list of purchases to checkout.
     * @returns {Promise<Object>} - A promise that resolves to the response object from the server.
     * @throws {Error} - If there is an error during the checkout, this promise will reject with an error object.
     */
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

    /**
    * Get the list of categories
    */
    static getCategories = async () => {
        let response = await fetch('/api/categories');
        
        try {
            if (!response.ok) {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'Error while getting the categories');
            }

            const responseData = await response.json();
            return responseData;

        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    }

    /**
     * Retrieve items from the store that match the given category name.
     * @param {string} categoryName - The name of the category to filter by.
     * @returns {Promise<Object[]>} - A promise that resolves to an array of item objects that match the category.
     * @throws {Error} - If there is an error retrieving the items, this promise will reject with an error object.
     */
    static getFilterItems = async (categoryName) => {
        let response = await fetch(`/api/items/categories/${categoryName}`);

        try {
            if (!response.ok) {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'Error while filtering the items');
            }

            const itemsJson = await response.json();
            return itemsJson;

        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    }

    //------------- ITEMS ------------

    /**
     * Get the list of items store
     */
    static getItems = async () => {
        let response = await fetch('/api/items');

        try {
            if (!response.ok) {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'Error while getting the items of the store');
            }

            const itemsJson = await response.json();
            return itemsJson;

        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    }

    /**
     * Add a new item to the store.
     * @param {Object} item - The item to add.
     * @returns {Promise<Object>} - A promise that resolves to the created item object.
     * @throws {Error} - If there is an error adding the item, this promise will reject with an error object.
     */
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

    /**
     * Remove an item from the store.
     * @param {number} id - The id of the item to remove.
     * @returns {Promise<Object>} - A promise that resolves to the removed item object.
     * @throws {Error} - If there is an error removing the item, this promise will reject with an error object.
     */
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

    /**
     * Retrieve an item from the store by its id.
     * @param {number} itemId - The id of the item to retrieve.
     * @returns {Promise<Object>} - A promise that resolves to the retrieved item object.
     * @throws {Error} - If there is an error retrieving the item, this promise will reject with an error object.
     */
    static getItemById = async (itemId) => {
        let response = await fetch(`/api/items/${itemId}`);

        try {
            if (!response.ok) {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'Error while removing item from the store');
            }

            const itemsJson = await response.json();
            return itemsJson;

        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    }

    //------------- WISHLIST ------------

    /**
     * Retrieve the wishlist for a given user.
     * @param {number} userId - The id of the user to retrieve the wishlist for.
     * @returns {Promise<Object[]>} - A promise that resolves to an array of item objects in the user's wishlist.
     * @throws {Error} - If there is an error retrieving the wishlist, this promise will reject with an error object.
     */
    static getWishlistByUser = async (userId) => {
        try {
            let response = await fetch(`/api/wishlist/${userId}`);

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Error while retrieving the wishlist');
            }

            const wishlistJson = await response.json();
            return wishlistJson;

        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve the wishlist for a given user and visibility.
     * @param {number} userId - The id of the user to retrieve the wishlist for.
     * @param {string} visibility - The visibility of the items in the wishlist.
     * @returns {Promise<Object[]>} - A promise that resolves to an array of item objects in the user's wishlist
     * with the specified visibility.
     * @throws {Error} - If there is an error retrieving the wishlist, this promise will reject with an error object.
     */
    static getWishlistByVisibility = async (userId, visibility) => {
        try {
            let response = await fetch(`/api/wishlist/${userId}/${visibility}`);

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Error while retrieving the wishlist');
            }

            const wishlistJson = await response.json();
            return wishlistJson;

        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve the list of item titles for a given category.
     * @param {string} categoryName - The name of the category to retrieve the items for.
     * @returns {Promise<Object[]>} - A promise that resolves to an array of item objects, with the shape
     * { id: number, name: string, price: number }, containing the titles of items in the category.
     * @throws {Error} - If there is an error retrieving the items, this promise will reject with an error object.
     */
    static getFilterTitle = async (categoryName) => {
        try {
            let response = await fetch(`/api/items/titles/${categoryName}`);
            
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Error while retrieving the list of item titles');
            }

            const itemJson = await response.json();
            return itemJson;

        } catch (error) {
            throw error;
        }
    }

    /**
     * Adds a new item to the user's wishlist.
     * @param {number} userId - The ID of the user to add the item to.
     * @param {Object} item - The item object to add to the wishlist.
     * @param {boolean} visibility - The visibility of the item in the wishlist.
     * @returns {Promise<Object>} - A promise that resolves to the added item object with the shape
     * { id: number, name: string, price: number, visibility: boolean }.
     * @throws {Error} - If there is an error adding the item, this promise will reject with an error object.
     */
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

    /**
     * Removes an item from the user's wishlist.
     * @param {number} userId - The ID of the user to remove the item from.
     * @param {number} itemId - The ID of the item to remove from the wishlist.
     * @returns {Promise<Response>} - A promise that resolves to the response object from the server.
     * @throws {Error} - If there is an error removing the item, this promise will reject with an error object.
     */
    static removeItemFromWishlist = async (userId, itemId) => {
        const response = await fetch(`/api/user/${userId}/wishlist/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        try {
            if (!response.ok) {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'Error while removing the item from the wishlist');
            }

            const responseData = await response.json();
            return responseData;

        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    }

    //------------- COMMENT ------------

    /**
     * Add a comment to a given item.
     * @param {Object} comment - The comment to add.
     * @param {number} comment.idItem - The id of the item to comment.
     * @param {string} comment.text - The comment text.
     * @returns {Promise<Object>} - A promise that resolves to the response object from the server.
     * @throws {Error} - If there is an error during the comment addition, this promise will reject with an error object.
     */
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

    /**
     * Remove a comment from the server.
     * @param {number} commentId - The id of the comment to remove.
     * @returns {Promise<Object>} - A promise that resolves to the response object from the server.
     * @throws {Error} - If there is an error during the comment removal, this promise will reject with an error object.
     */
    static removeComment = async (commentId) => {

        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        try {
            if (!response.ok) {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'An error occurred while removing the comment.');
            }

            const responseData = await response.json();
            return responseData;
        } catch (err) {
            throw new Error(err.message || 'Network error');
        }

    }

    /**
     * Update a comment on the server.
     * @param {string} text - The new text for the comment.
     * @param {number} idComment - The id of the comment to update.
     * @returns {Promise<Object>} - A promise that resolves to the response object from the server.
     * @throws {Error} - If there is an error during the comment update, this promise will reject with an error object.
     */
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

    //------------- SEARCH ------------

    /**
     * Fetches the comments made by the user with the given ID from the server.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<Object[]>} - A promise that resolves to an array of comment objects.
     * @throws {Object} - If there is an error during the fetch, this promise will reject with an error object.
     */
    static getCommentsbyUserId = async (userId) => {
        let response = await fetch(`/api/search/user/${userId}/comments`);

        try {
            if (!response.ok) {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'No comments found.');
            }

            const commentsJson = await response.json();
            return commentsJson;

        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    }

    /**
     * Fetches the comments made on the item with the given ID from the server.
     * @param {number} itemId - The ID of the item.
     * @returns {Promise<Object[]>} - A promise that resolves to an array of comment objects.
     * @throws {Object} - If there is an error during the fetch, this promise will reject with an error object.
     */
    static getCommentsbyItemId = async (itemId) => {
        try {
            let response = await fetch(`/api/search/items/${itemId}/comments`);
            if (response.ok) {
                const commentsJson = await response.json();
                return commentsJson;
            } else {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'No comments found.');
            }
        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    }

    /**
     * Fetches the comments made by the user with the given ID on the item with the given ID from the server.
     * @param {number} userId - The ID of the user.
     * @param {number} itemId - The ID of the item.
     * @returns {Promise<Object[]>} - A promise that resolves to an array of comment objects.
     * @throws {Object} - If there is an error during the fetch, this promise will reject with an error object.
     */
    static getCommentsbyUserIdandItemId = async (userId, itemId) => {
        try {
            let response = await fetch(`/api/search/user/${userId}/items/${itemId}/comments`);
            if (response.ok) {
                const commentsJson = await response.json();
                return commentsJson;
            } else {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'No comments found.');
            }
        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    }

    /**
     * Fetches the comments containing the given keyword from the server.
     * @param {string} keyword - The keyword to search.
     * @returns {Promise<Object[]>} - A promise that resolves to an array of comment objects.
     * @throws {Error} - If there is an error during the fetch, this promise will reject with an error object.
     */
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
            throw new Error(error.message || 'Network error');
        }
    }

    /**
     * Fetches the items in the given category and price range from the server.
     * @param {string} category - The category of the items.
     * @param {number} priceMin - The minimum price of the items.
     * @param {number} priceMax - The maximum price of the items.
     * @returns {Promise<Object[]>} - A promise that resolves to an array of item objects.
     * @throws {Object} - If there is an error during the fetch, this promise will reject with an error object.
     */
    static getSearchByCategoryAndPrice = async (category, priceMin, priceMax) => {
        try {
            let response = await fetch(`/api/search/${category}/${priceMin}/${priceMax}`);
            if (response.ok) {
                const itemsJson = await response.json();
                return itemsJson;
            } else {
                const errDetail = await response.json();
                throw new Error(errDetail.message || 'No items found.');
            }
        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    }

}

export default Api;