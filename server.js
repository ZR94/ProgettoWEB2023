"use strict";

// imports
const express = require('express');
const morgan = require('morgan'); // logging middleware
const path = require('path');
const { check, validationResult } = require('express-validator'); // validation middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const dao = require('./dao.js');
//const bcrypt = require('bcrypt');

// init 
const app = express();
const port = 3000;

// set up the middleware
app.use(morgan('tiny'));

// serving static request
app.use(express.static('myapp'));

// interpreting json-encoded parameters
app.use(express.json());

// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    dao.getUser(username, password).then(({ user, check }) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!check) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  dao.getUserById(id).then(user => {
    done(null, user);
  });
});

// check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ "statusCode": 401, "message": "not authenticated" });
}

// set up the session
app.use(session({
  store: new FileStore({ path: path.resolve(__dirname, 'sessions') }),
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false,
  // removing the following line will cause a browser's warning, since session cookie
  // cross-site default policy is currently not recommended
  cookie: { sameSite: 'lax' }
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());

// === REST API (item, user, session) === //

// POST /users

// Sign up
app.post('/api/user', [
  check('user.email').isEmail().withMessage('Email is required and must be a valid email address'),
  check('user.password').isLength({ min: 1 }).withMessage('Password is required and must not be empty'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const user = {
    name: req.body.user.name,
    surname: req.body.user.surname,
    email: req.body.user.email,
    password: req.body.user.password,
    admin: req.body.user.admin,
  };

  dao.createUser(user)
    .then((result) => {
      if (result) {
        res.status(201).json({ success: true, message: 'Account creato con successo' });
      } else {
        res.status(500).json({ success: false, error: 'Database error during the signup' });
      }
    })
});

// POST /sessions 

// Login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, function (err) {
      if (err) { return next(err); }
      // req.user contains the authenticated user
      return res.json(req.user);
    });
  })(req, res, next);
});

app.post('/api/checkout', isLoggedIn, (req, res) => {
  const listPurchase = req.body.listPurchase;

  const insertAllPurchases = async () => {
    const promises = listPurchase.map(purchase => dao.createPurchase(purchase));
    await Promise.all(promises);
  };

  insertAllPurchases()
    .then(() => res.status(200).json({ message: 'Item added to purchase successfully' }))
    .catch((err) => res.status(err.status || 500).json({ error: err.msg || 'An error occurred' }));

});

app.post('/api/comments', [
  check('comment.idUser').notEmpty().withMessage('User ID is required'),
  check('comment.idItem').notEmpty().withMessage('Item ID is required'),
  check('comment.text').notEmpty().withMessage('Comment text is required'),
], (req, res) => {

  const idUser = req.body.comment.idUser;
  const idItem = req.body.comment.idItem;
  const text = req.body.comment.text;
  dao.addComment(idUser, idItem, text)
    .then(() => res.status(200).json({ success: true, message: 'Comment added successfully' }))
    .catch((err) => res.status(err.status || 500).json({ error: err.msg || 'An error occurred' }));
});

app.post('/api/user/:userId', [], (req, res) => {

  const idUser = req.params.userId;
  const { birthdate, address, city } = req.body.dataInfo;

  if (!birthdate || !address || !city, !idUser) {
    return res.status(400).json({ success: false, error: 'Dati non validi' });
  }

  dao.addInfoUser(birthdate, address, city, idUser)
    .then((result) => {
        if (result.success) {
            res.status(200).json({ success: true, message: 'Info updated successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Info not modified' });
        }
    })
    .catch((err) => res.status(err.status || 500).json({ success: false, error: err.msg || 'An error occurred' }));
});

// Aggiunge un item alla wishlist dell'utente, dato il suo id.
app.post('/api/user/:userId/wishlist', [
  check('item.id').notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const itemId = req.body.item.id;
  const userId = req.params.userId;
  const visibility = req.body.visibility;
  dao.addItemInWishList(userId, itemId, visibility)
    .then(() => res.status(200).json({ success: true, message: 'Item added to wishlist successfully' }))
    .catch((err) => res.status(err.status || 500).json({ error: err.msg || 'An error occurred' }));
});

app.post('/api/item', (req, res) => {
  const item = {
    price: req.body.item.price,
    name: req.body.item.name,
    category: req.body.item.category,
    img: req.body.item.img,
  };
  dao.createItem(item)
    .then(() => res.status(201).json({ success: true, message: 'Item creato con successo' }))
    .catch((err) => res.status(503).json({ error: err.msg || 'Database error during the item creation' }));

})

// DELETE /sessions/current

// Logout
app.delete('/api/sessions/current', isLoggedIn, function (req, res) {
  req.logout(function (err) {
    if (err) { return res.status(503).json(err); }
  });
  res.end();
});

app.delete('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;

  dao.deleteUser(userId)
    .then(() => res.status(200).json({ success: true, message: 'Account eliminato con successo' }))
    .catch((err) => res.status(err.status || 500).json({ success: false, message: err.msg || 'Errore durante l\'eliminazione dell\'account' }));
});

// Rimuove un item dalla wishlist dell’utente, dato il suo id.
app.delete('/api/user/:userId/wishlist/:itemId', (req, res) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;
  dao.deleteItemInWishList(userId, itemId)
    .then((result) => {
      if (result && result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Item not found in wishlist" });
      }
    })
    .catch((err) =>
      res.status(500).json({
        errors: [{ param: "Server", msg: err.message }],
      })
    );
});

// Rimuove un commento dell’utente, dato il suo id.
app.delete('/api/comments/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  dao.deleteComment(commentId)
  .then(() => res.status(200).json({ success: true, message: 'Commento eliminato con successo' }))
  .catch((err) => res.status(503).json({ error: err.msg || 'Database error during the item creation' }));
});

app.delete('/api/item/:itemId', (req, res) => {
  const itemId = req.params.itemId;

  dao.deleteItem(itemId)
    .then(() => res.status(200).json({ success: true, message: 'Item eliminato con successo' }))
    .catch((err) => res.status(err.status || 500).json({ success: false, message: err.msg || 'Errore durante l\'eliminazione dell\'item' }));
});

// GET /items

app.get('/api/items', isLoggedIn, (req, res) => {
  dao.getAllItems()
    .then(items => res.json(items))
    .catch(error => res.status(500).json(error));
});

app.get('/api/users', isLoggedIn, (req, res) => {
  dao.getAllUsers()
    .then(users => res.json(users))
    .catch(error => res.status(500).json(error));
});

app.get('/api/categories', (req, res) => {
  dao.getAllCategories()
    .then(categories => res.json(categories))
    .catch(error => res.status(500).json(error));
});

app.get('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  dao.getItemById(itemId)
    .then(item => res.json(item))
    .catch(error => res.status(500).json(error));
});

app.get('/api/user/:id', isLoggedIn, (req, res) => {
  const userId = req.params.id;
  dao.getUserById(userId)
    .then(user => res.json(user))
    .catch(error => res.status(500).json(error));
});

// GET /api/wishlist/:id

app.get('/api/wishlist/:id', (req, res) => {
  const userId = req.params.id;
  dao.getWishlistByUserId(userId)
    .then((wishlist) => res.json(wishlist))
    .catch((error) => res.status(404).json(error));
});

app.get('/api/wishlist/:id/:visibility', (req, res) => {
  const userId = req.params.id;
  const visibility = req.params.visibility;
  dao.getWishlistByVisibility(userId, visibility)
    .then((wishlist) => res.json(wishlist))
    .catch((error) => res.status(404).json(error));
});

app.get('/api/items/categories/:categoryName', (req, res) => {
  const categoryName = req.params.categoryName;
  let result;
  if (categoryName === 'all-categories') {
    result = dao.getAllItems();
  } else {
    result = dao.getItemsByCategory(categoryName)
  }
  result
    .then((categories) => res.json(categories))
    .catch((error) => res.status(404).json(error));
});

app.get('/api/search/user/:userId/comments', (req, res) => {
  const userId = req.params.userId;
  dao.getCommentByUserId(userId)
    .then((comments) => res.json(comments))
    .catch((error) => res.status(404).json(error));
});

app.get('/api/search/items/:itemId/comments', (req, res) => {
  const itemId = req.params.itemId;
  dao.getCommentByItemId(itemId)
    .then((comments) => res.json(comments))
    .catch((error) => res.status(404).json(error));
});

app.get('/api/search/user/:userId/items/:itemId/comments', (req, res) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;
  dao.getCommentByUserIdAndItemId(userId, itemId)
    .then((comments) => res.json(comments))
    .catch((error) => res.status(404).json(error));
})

app.get('/api/search/comments/:keyword', (req, res) => {
  const keyword = req.params.keyword;
  dao.getCommentsByKeyword(keyword)
    .then((comments) => res.json(comments))
    .catch((error) => res.status(404).json(error));
});

app.get('/api/user/:userId/history', (req, res) => {
  const userId = req.params.userId;
  dao.getHistoryByUserId(userId)
    .then((history) => res.json(history))
    .catch((error) => res.status(404).json(error));
});

app.get('/api/search/:category/:priceMin/:priceMax', isLoggedIn, (req, res) => {
  const category = req.params.category;
  const priceMin = req.params.priceMin;
  const priceMax = req.params.priceMax;
  dao.getItemsByCategoryAndPrice(category, priceMin, priceMax)
    .then((items) => res.json(items))
    .catch((error) => res.status(404).json(error));
});

app.put('/api/comments/:idComment',
  (req, res) => {
    const idComment = req.params.idComment;
    const text = req.body.text;
    dao.updateComment(idComment, text)
    .then(() => res.status(201).json({ success: true, message: 'Commento aggiornato con successo' }))
    .catch((err) => res.status(503).json({ error: err.msg || 'Database error during the item creation' }));
  }
);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'myapp/index.html'));
});

app.listen(port, () => console.log(`server listening at http://localhost:${port}`));