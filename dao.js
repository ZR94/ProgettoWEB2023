"use strict";

const db = require('./db.js');
const bcrypt = require('bcrypt');

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


exports.createUser = function (user) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO user (name, surname, email, password, admin) VALUES (?, ?, ?, ?, ?)';
        // create the hash as an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
        bcrypt.hash(user.password, 10).then((hash => {
            db.run(sql, [user.name, user.surname, user.email, hash, user.admin], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user.id);
                }
            });
        }));
    });
};


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

exports.deleteItem = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM item WHERE idItem = ?';
        db.run(sql, [id], (err) => {
            if (err) reject(err);
            else {
                resolve({ success: true, message: 'Item eliminato con successo' });
            }
        });
    });
};

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE idUser = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = { id: row.idUser, name: row.name, surname: row.surname, email: row.email, admin: row.admin };
                resolve(user);
            }
        });
    });
};

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

exports.deleteItemInWishList = function (userId, itemId) {
    return new Promise((resolve, reject) => {
        const del = "DELETE FROM wishlist WHERE idWishItem = ? AND idWishUser = ?";
        db.run(del, [itemId, userId], (err) => {
            if (err) {
                reject({ status: 500, msg: err.message });
            } else {
                resolve();
            };
        });
    });
};

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