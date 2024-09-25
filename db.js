'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('DbNegozio.db', (err) => {
  if (err) throw err;

  db.get('PRAGMA foreign_keys = ON');
});

module.exports = db;