"use strict";

const db = require('./db.js');
const bcrypt = require('bcrypt');

//------------- USER ------------

/**
 * Creates a new user in the database, after checking if the email already exists
 * @param {Object} user - User data: name, surname, email, password, and admin (1 or 0)
 * @returns {Promise<Object>} A promise that resolves to an object with a success property set to true and a message property with a success message
 */
exports.createUser = function (user) {
    return new Promise((resolve, reject) => {
        const checkEmailSql = 'SELECT email FROM user WHERE email = ?';
        db.get(checkEmailSql, [user.email], (err, row) => {
            if (err) {
                reject({ status: 500, msg: err.message })
            } else if (row) {
                reject({ success: false, message: 'This email already exists. Please use a different email' });
            } else {
                const insertUserSql = 'INSERT INTO user (name, surname, email, password, admin) VALUES (?, ?, ?, ?, ?)';
                bcrypt.hash(user.password, 10).then((hash) => {
                    db.run(insertUserSql, [user.name, user.surname, user.email, hash, user.admin], (err) => {
                        if (err) {
                            reject({ status: 500, msg: err.message })
                        } else {
                            resolve({ success: true, message: 'Account created successfully' });
                        }
                    });
                }).catch((hashError) => {
                    reject(hashError);
                });
            }
        });
    });
};

/**
 * Deletes a user from the database
 * @param {number} id - The id of the user to delete
 * @returns {Promise<Object>} A promise that resolves to an object with a success property set to true and a message property with a success message
 */
exports.deleteUser = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM user WHERE idUser = ?';
        db.run(sql, [id], (err) => {
            if (err) reject(err);
            else {
                resolve({ success: true, message: 'Account eliminato con successo' });
            }
        });
    });
};

/**
 * Retrieves all users from the database
 * @returns {Promise<Object[]>} A promise that resolves to an array of user objects, each with properties id, name, surname, and email
 */
exports.getAllUsers = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const users = rows.map((row) => ({ id: row.idUser, name: row.name, surname: row.surname, email: row.email }));
            resolve(users);
        });
    });
};

/**
 * Retrieves a user from the database by its id
 * @param {number} id - The id of the user to retrieve
 * @returns {Promise<Object>} A promise that resolves to an object with the user's data or an error message
 */
exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE idUser = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = { 
                    id: row.idUser, 
                    name: row.name, 
                    surname: row.surname, 
                    email: row.email, 
                    admin: row.admin,
                    birthdate: row.birthDate,
                    address: row.address,
                    city: row.city };
                resolve(user);
            }
        });
    });
};

/**
 * Retrieves a user from the database by its email and password
 * @param {string} email - The email of the user to retrieve
 * @param {string} password - The password of the user to retrieve
 * @returns {Promise<Object>} A promise that resolves to an object with the user's data and a boolean indicating if the password is correct or an error message
 */
exports.getUser = function (email, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = { id: row.idUser, name: row.name, email: row.email };
                let check = false;

                if (bcrypt.compareSync(password, row.password))
                    check = true;

                resolve({ user, check });
            }
        });
    });
};

/**
 * Updates the user's information (birthdate, address, city) in the database.
 * @param {string} birthdate - The user's birthdate.
 * @param {string} address - The user's address.
 * @param {string} city - The user's city.
 * @param {number} idUser - The user's ID.
 * @returns {Promise<Object>} A promise that resolves to an object with a success message or an error message.
 */
exports.addInfoUser = function (birthdate, address, city, idUser) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE user SET birthDate = ?, address = ?, city = ? WHERE idUser = ?';
        db.run(sql, [birthdate, address, city, idUser], function(err) {  
            if (err) {
                reject({ status: 500, msg: err.message });
            } else if (this.changes === 0) {  
                reject({ status: 400, msg: 'No record updated. Invalid user ID or data not changed.' });
            } else {
                resolve({ success: true, message: 'Info updated successfully' });
            }
        });
    });
};

//------------- PURCHASE ------------

/**
 * Creates a new purchase in the database
 * @param {Object} purchase - Purchase data: idUser, idItem, qta, price, and dateTime
 * @returns {Promise<number>} A promise that resolves to the id of the newly created purchase
 */
exports.createPurchase = function (purchase) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO purchase(idPurchaseUser, idPurchaseItem, qta, price, dateTime) VALUES (?, ?, ?, ?, ?)';
        db.run(sql, [purchase.idUser, purchase.idItem, purchase.qta, purchase.price, purchase.dateTime], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(purchase.idPurchase);
        });
    });
};

/**
 * Gets the purchase history of the user with the given ID from the database.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the purchase history.
 */
exports.getHistoryByUserId = function (userId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM purchase WHERE idPurchaseUser = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve({ error: 'History not found.' });
            else {
                const history = rows.map((row) => ({ idPurchase: row.idPurchase, idPurchaseUser: row.idPurchaseUser, idPurchaseItem: row.idPurchaseItem, qta: row.qta, price: row.price, dateTime: row.dateTime }));
                resolve(history.sort((a, b) => a.idPurchaseUser - b.idPurchaseUser));
            }
        });
    });
}

/**
 * Retrieves all categories from the database
 * @returns {Promise<Object[]>} A promise that resolves to an array of category objects, each with properties id and obj
 */
exports.getAllCategories = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM category';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const categories = rows.map((row) => ({ id: row.idCategory, obj: row.obj }));
            resolve(categories);
        });
    });
};

//------------- ITEM ------------

/**
 * Creates a new item in the database
 * @param {Object} item - The item object with its properties.
 * @returns {Promise<number>} A promise that resolves to the ID of the newly created item.
 */
exports.createItem = function (item) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO item(price, name, img, category) VALUES (?, ?, ?, ?)';
        db.run(sql, [item.price, item.name, item.img, item.category], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

/**
 * Deletes an item from the database
 * @param {number} id - The ID of the item to delete.
 * @returns {Promise<void>} A promise that resolves when the item has been deleted.
 */
exports.deleteItem = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM item WHERE idItem = ?';
        db.run(sql, [id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

/**
 * Retrieves all items from the database
 * @returns {Promise<Object[]>} A promise that resolves to an array of item objects, each with properties id, price, name, img, and category
 */
exports.getAllItems = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM item';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const items = rows.map((row) => ({ id: row.idItem, price: row.price, name: row.name, img: row.img, category: row.category }));
            resolve(items);
        });
    });
};

/**
 * Retrieves an item by its ID from the database
 * @param {number} id - Item's unique ID
 * @returns {Promise<Object>} A promise that resolves to an object with properties id, price, name, img, and category
 */
exports.getItemById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM item WHERE idItem = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'Item not found.' });
            else {
                const item = {
                    id: row.idItem, price: row.price, name: row.name, img: row.img, category: row.category
                }
                resolve(item);
            }
        });
    });
};

//------------- WISHLIST ------------

/**
 * Gets the wishlist of a user by their ID.
 * @param {number} userId - The user's ID.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the wishlist items.
 */
exports.getWishlistByUserId = function (userId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM wishlist WHERE idWishUser = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve({ error: 'Wishlist not found.' });
            else {
                const item = rows.map((row) => ({ idWishUser: row.idWishUser, idWishItem: row.idWishItem, visibility: row.visibility }));
                resolve(item.sort((a, b) => a.idWishItem - b.idWishItem));
            }
        });
    });
};

/**
 * Gets the wishlist of a user filtered by visibility.
 * @param {number} userId - The user's ID.
 * @param {string} visibility - The visibility of the wishlist items. Can be 'public', 'private' or 'all'.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the wishlist items with the specified visibility.
 */
exports.getWishlistByVisibility = function (userId, visibility) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM wishlist WHERE idWishUser = ? and visibility = ?';
        db.all(sql, [userId, visibility], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve({ error: 'Wishlist not found.' });
            else {
                const item = rows.map((row) => ({ idWishUser: row.idWishUser, idWishItem: row.idWishItem, visibility: row.visibility }));
                resolve(item.sort((a, b) => a.idWishItem - b.idWishItem));
            }
        });
    });
};

/**
 * Adds an item to the wishlist of the user.
 * @param {number} userId - The user's ID.
 * @param {number} itemId - The item's ID.
 * @param {string} visibility - The visibility of the item. Can be 'public', 'private' or 'all'.
 * @returns {Promise<number>} - A promise that resolves to the ID of the inserted item, or rejects with an error.
 */
exports.addItemInWishList = function (userId, itemId, visibility) {
    return new Promise((resolve, reject) => {
        // controlla se l'item non sia già nella wishlist dell'utente
        const sql = "SELECT * FROM wishlist WHERE idWishUser = ? AND idWishItem = ?";
        db.all(sql, [userId, itemId], (err, rows) => {
            if (err) {
                reject({ status: 500, msg: err.message })
            } else {
                if (rows.length) {
                    reject({ status: 422, msg: `errore: item con id ${itemId} già presente nella wishlist dell'utente ${userId}.` });
                }
                else {
                    const ins = "INSERT INTO wishlist (idWishItem, idWishUser, visibility) VALUES (?,?,?)";
                    db.run(ins, [itemId, userId, visibility], (err) => {
                        if (err) {
                            reject({ status: 500, msg: err.message });
                        }
                        resolve(this.id);
                    });
                }
            }
        });
    });
};

/**
 * Deletes an item from the wishlist of the user.
 * @param {number} userId - The user's ID.
 * @param {number} itemId - The item's ID.
 * @returns {Promise<Object>} - A promise that resolves to an object with a success property and a message property describing the result of the operation.
 */
exports.deleteItemInWishList = function (userId, itemId) {
    return new Promise((resolve, reject) => {
        const del = "DELETE FROM wishlist WHERE idWishItem = ? AND idWishUser = ?";
        db.run(del, [itemId, userId], function(err) {
            if (err) {
                reject({ status: 500, msg: err.message });
            } else if (this.changes === 0) {
                resolve({ success: false, message: 'Item not found in wishlist' });
            } else {
                resolve({ success: true, message: 'Item removed from wishlist' });
            }
        });
    });
};

//------------- COMMENT ------------

/**
 * Adds a comment to the database.
 * @param {number} userId - The ID of the user that is adding the comment.
 * @param {number} itemId - The ID of the item on which the comment is being added.
 * @param {string} text - The text of the comment.
 * @returns {Promise<number>} - A promise that resolves to the ID of the added comment.
 */
exports.addComment = function (userId, itemId, text) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO comment (idCommentUser, idCommentItem, text) VALUES (?,?,?)";
        db.run(sql, [userId, itemId, text], (err) => {
            if (err) {
                reject({ status: 500, msg: err.message });
            } else {
                resolve(this.idComment);
            };
        });
    });
};

/**
 * Deletes a comment from the database.
 * @param {number} commentId - The ID of the comment to delete.
 * @returns {Promise<Object>} - A promise that resolves to an object with a success property and a message property describing the result of the operation.
 */
exports.deleteComment = function (commentId) {
    return new Promise((resolve, reject) => {
        const del = "DELETE FROM comment WHERE idComment = ?";
        db.run(del, [commentId], (err) => {
            if (err) {
                reject({ status: 500, msg: err.message });
            } else {
                resolve({ success: true, message: 'Commento eliminato con successo' });
            };
        });
    });
};

/**
 * Updates a comment in the database.
 * @param {number} id - The ID of the comment to update.
 * @param {string} text - The new text of the comment.
 * @returns {Promise<Object>} - A promise that resolves to an object with a success property and a message property describing the result of the operation.
 */
exports.updateComment = (id, text) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE comment SET text = ? WHERE idComment = ?";
        db.run(sql, [text, id], function (err) {
            if (err) {
                reject({ status: 500, message: `Errore durante l'aggiornamento del commento: ${err.message}` });
            } else {
                if (this.changes > 0) {
                    resolve({ success: true, message: 'Commento aggiornato con successo' });
                } else {
                    reject({ status: 404, message: 'Nessun commento trovato con questo ID' });
                }
            }
        });
    });
};

//------------- SEARCH ------------

/**
 * Retrieves all items of a given category from the database
 * @param {string} categoryName - The name of the category.
 * @returns {Promise<Object[]>} A promise that resolves to an array of item objects, each with properties id, price, name, img, category, idCategory, and obj.
 */
exports.getItemsByCategory = function (categoryName) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM item JOIN category ON category.idCategory = item.category WHERE category.obj = ?";
        db.all(sql, [categoryName], (err, row) => {
            if (err)
                reject(err);
            else if (row.length === 0)
                resolve({ error: 'Items not found.' });
            else {
                const item = row.map((row) => ({ id: row.idItem, price: row.price, name: row.name, img: row.img, category: row.category, idCategory: row.idCategory, obj: row.obj }));
                resolve(item);
            }
        });
    });
};

/**
 * Retrieves all items of a given category and price range from the database
 * @param {string} category - The name of the category.
 * @param {number} priceMin - The minimum price of the items.
 * @param {number} priceMax - The maximum price of the items.
 * @returns {Promise<Object[]>} A promise that resolves to an array of item objects, each with properties id, price, name, img, category, idCategory, and obj.
 */
exports.getItemsByCategoryAndPrice = function (category, priceMin, priceMax) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM item JOIN category ON category.idCategory = item.category WHERE category.idCategory = ? AND item.price BETWEEN ? AND ?";
        db.all(sql, [category, priceMin, priceMax], (err, row) => {
            if (err)
                reject(err);
            else if (row.length === 0)
                resolve({ error: 'Items not found.' });
            else {
                const item = row.map((row) => ({ id: row.idItem, price: row.price, name: row.name, img: row.img, category: row.category, idCategory: row.idCategory, obj: row.obj }));
                resolve(item);
            }
        });
    });
}

/**
 * Gets all the comments of a user from the database.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the comments.
 */
exports.getCommentByUserId = function (userId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM comment WHERE idCommentUser = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve({ error: 'Comments not found.' });
            else {
                const comment = rows.map((row) => ({ id: row.idComment, idCommentUser: row.idCommentUser, idCommentItem: row.idCommentItem, text: row.text }));
                resolve(comment.sort((a, b) => a.idCommentItem - b.idCommentItem));
            }
        });
    });
};

/**
 * Gets all the comments of an item from the database.
 * @param {number} id - The ID of the item.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the comments.
 */
exports.getCommentByItemId = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM comment WHERE idCommentItem = ?';
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve({ error: 'Comments not found.' });
            else {
                const comment = rows.map((row) => ({ id: row.idComment, idCommentUser: row.idCommentUser, idCommentItem: row.idCommentItem, text: row.text }));
                resolve(comment.sort((a, b) => a.idCommentItem - b.idCommentItem));
            }
        });
    });
};

/**
 * Gets all the comments of an item made by a user from the database.
 * @param {number} userId - The ID of the user.
 * @param {number} itemId - The ID of the item.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the comments.
 */
exports.getCommentByUserIdAndItemId = function (userId, itemId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM comment WHERE idCommentUser = ? AND idCommentItem = ?';
        db.all(sql, [userId, itemId], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve({ error: 'Comments not found.' });
            else {
                const comments = rows.map((row) => ({
                    id: row.idComment,
                    idCommentUser: row.idCommentUser,
                    idCommentItem: row.idCommentItem,
                    text: row.text
                }));
                resolve(comments.sort((a, b) => a.idComment - b.idComment));
            }
        });
    });
};

/**
 * Gets all the comments that contain a given keyword from the database.
 * @param {string} keyword - The keyword to search in the comments.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the comments.
 */
exports.getCommentsByKeyword = function (keyword) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM comment WHERE text LIKE ?';
        const searchKeyword = `%${keyword}%`;
        db.all(sql, [searchKeyword], (err, rows) => {
            if (err) {
                reject(err);
            } else if (rows.length === 0) {
                resolve({ error: 'No comments found containing the keyword.' });
            } else {
                const comments = rows.map((row) => ({
                    id: row.idComment,
                    idCommentUser: row.idCommentUser,
                    idCommentItem: row.idCommentItem,
                    text: row.text
                }));
                resolve(comments.sort((a, b) => a.idComment - b.idComment));
            }
        });
    });
};