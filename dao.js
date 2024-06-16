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
            resolve(item.code);
        });
    });
};

exports.deleteItem = function (item) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM item WHERE idItem = ?';
        db.run(sql, [item.id], (err) => {
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
        const sql = 'INSERT INTO user (name, surname, email, password) VALUES (?, ?, ?, ?)';
        // create the hash as an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
        bcrypt.hash(user.password, 10).then((hash => {
            db.run(sql, [user.name, user.surname, user.email, hash], (err) => {
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
        const sql = 'INSERT INTO purchase(idPurchaseUser, idPurchaseItem, qta, price) VALUES (?, ?, ?, ?)';
        db.run(sql, [purchase.idUser, purchase.idItem, purchase.qta, purchase.price], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(purchase.idPurchase);
        });
    });
};

exports.deleteUser = function (user) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM user WHERE idUser = ?';
        db.run(sql, [user.id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
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
                const user = { id: row.idUser, name: row.name, surname: row.surname, email: row.email }
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
        db.all(sql, [userId], (err, row) => {
            if (err)
                reject(err);
            else if (row.length === 0)
                resolve({ error: 'Wishlist not found.' });
            else {
                const item = row.map((row) => ({ idWishUser: row.idWishUser, idWishItem: row.idWishItem }));
                resolve(item);
            }
        });
    });
};

exports.addItemInWishList = function (userId, itemId) {
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
                    const ins = "INSERT INTO wishlist (idWishItem, idWishUser) VALUES (?,?)";
                    db.run(ins, [itemId, userId], (err) => {
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
