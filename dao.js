"use strict";

const db = require('./db.js');

exports.getAllItems = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM items';
        db.all(sql, (err,rows) => {
            if (err) {
                reject(err);
                return;
            }

            const items = rows.map( (row)=> ({code:row.code, name:row.name, credits:row.CFU}));
            resolve(items);
        });
    });
};