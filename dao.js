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

            const items = rows.map( (row)=> ({id:row.id, price:row.price, name:row.name, img:row.img}));
            resolve(items);
        });
    });
};

exports.getUserById = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else {
                const user = {id: row.id, username: row.email}
                resolve(user);
            }
        });
    });
  };

exports.getUser = function(email, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else {
              const user = {id: row.id, username: row.email};
              let check = false;
              
              if(bcrypt.compareSync(password, row.password))
                check = true;
  
              resolve({user, check});
            }
        });
    });
  };