/**
 * @RobertoZuzzè
 * Matricola: 20046761
 */

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

// check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ "statusCode": 401, "message": "You are not authenticated" });
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

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  dao.getUserById(id).then(user => {
    done(null, user);
  });
});

// === REST API === //

// Sign up
app.post('/api/user', [
  check('user.email')
    .isEmail().withMessage('Email must be a valid email address')
    .notEmpty().withMessage('Email is required'),
  check('user.password')
    .isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
    .notEmpty().withMessage('Password is required'),
  check('user.name')
    .notEmpty().withMessage('First name is required'),
  check('user.surname')
    .notEmpty().withMessage('Last name is required'),
  check('user.admin')
    .optional()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
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
    .catch((error) => {
      return res.status(409).json({ success: false, message: error.message });
    });
});

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

// Logout
app.delete('/api/sessions/current', isLoggedIn, function (req, res) {
  req.logout(function (err) {
    if (err) { return res.status(503).json(err); }
  });
  res.end();
});

//------------- USER ------------

/**
 * Add user information (birthdate, address, city) to the database.
 * 
 * @param {string} birthdate - The user's birthdate.
 * @param {string} address - The user's address.
 * @param {string} city - The user's city.
 * @param {number} idUser - The user's ID.
 * @returns {Promise<Object>} A promise that resolves to an object with a success message or an error message.
 */
app.post('/api/users/:userId', isLoggedIn, (req, res) => {

  const idUser = req.params.userId;
  const { birthdate, address, city } = req.body.dataInfo;

  if (!birthdate || !address || !city || !idUser) {
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

/**
 * Deletes the user with the specified ID from the database.
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<Object>} A promise that resolves to an object with a success message or an error message.
 */
app.delete('/api/users/:userId', isLoggedIn, (req, res) => {
  const userId = req.params.userId;

  dao.deleteUser(userId)
    .then(() => res.status(200).json({ success: true, message: 'Account eliminato con successo' }))
    .catch((err) => res.status(err.status || 500).json({ success: false, message: err.msg || 'Errore durante l\'eliminazione dell\'account' }));
});

/**
 * Retrieves a list of all the users in the database.
 * @returns {Promise<Object[]>} A promise that resolves to an array of user objects.
 */
app.get('/api/users', isLoggedIn, (req, res) => {
  dao.getAllUsers()
    .then(users => res.json(users))
    .catch(error => res.status(500).json(error));
});

/**
 * Retrieves a user by ID from the database.
 * @param {number} id - The ID of the user to retrieve.
 * @returns {Promise<Object>} A promise that resolves to an object with the user's information.
 */
app.get('/api/users/:id', isLoggedIn, (req, res) => {
  const userId = req.params.id;
  dao.getUserById(userId)
    .then(user => res.json(user))
    .catch(error => res.status(500).json(error));
});

/**
 * Retrieves the purchase history of a user by ID.
 * @param {number} userId - The ID of the user to retrieve the history of.
 * @returns {Promise<Object[]>} A promise that resolves to an array of objects containing the purchase history of the user.
 */
app.get('/api/users/:userId/history', isLoggedIn, (req, res) => {
  const userId = req.params.userId;
  dao.getHistoryByUserId(userId)
    .then((history) => res.json(history))
    .catch((error) => res.status(404).json(error));
});

//------------- PURCHASE ------------

/**
 * Retrieves a list of all the categories in the database.
 * @returns {Promise<Object[]>} A promise that resolves to an array of category objects.
 */
app.get('/api/categories', (req, res) => {
  dao.getAllCategories()
    .then(categories => res.json(categories))
    .catch(error => res.status(500).json(error));
});

/**
 * Handle the checkout process.
 * @param {Object[]} req.body.listPurchase - A list of objects containing the items to purchase.
 * @returns {Promise<Object>} A promise that resolves to an object with a success message or an error message.
 */
app.post('/api/checkout', isLoggedIn, (req, res) => {
  const listPurchase = req.body.listPurchase;

  const insertAllPurchases = async () => {
    const promises = listPurchase.map(purchase => dao.createPurchase(purchase));
    await Promise.all(promises);
  };

  insertAllPurchases()
    .then(() => res.status(200).json({ message: 'Purchase completed successfully' }))
    .catch((err) => res.status(err.status || 500).json({ error: err.msg || 'An error occurred' }));

});

//------------- ITEM ------------

/**
 * Create a new item in the database.
 * @param {Object} req.body.item - The item to create.
 * @param {number} req.body.item.price - The price of the item.
 * @param {string} req.body.item.name - The name of the item.
 * @param {string} req.body.item.category - The category of the item.
 * @param {string} req.body.item.img - The image URL of the item.
 * @returns {Promise<Object>} A promise that resolves to an object with a success message or an error message.
 */
app.post('/api/items', isLoggedIn, (req, res) => {
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

/**
 * Retrieves a list of all the items in the database.
 * @returns {Promise<Object[]>} A promise that resolves to an array of objects containing the items.
 */
app.get('/api/items', isLoggedIn, (req, res) => {
  dao.getAllItems()
    .then(items => res.json(items))
    .catch(error => res.status(500).json(error));
});

/**
 * Retrieves an item by ID from the database.
 * @param {number} itemId - The ID of the item to retrieve.
 * @returns {Promise<Object>} A promise that resolves to an object with the item's information.
 */
app.get('/api/items/:id', isLoggedIn, (req, res) => {
  const itemId = req.params.id;
  dao.getItemById(itemId)
    .then(item => res.json(item))
    .catch(error => res.status(500).json(error));
});

/**
 * Retrieves a list of all the items of a given category from the database.
 * If the category name is 'all-categories', it returns all the items.
 * @param {string} req.params.categoryName - The name of the category.
 * @returns {Promise<Object[]>} A promise that resolves to an array of objects containing the items.
 */
app.get('/api/item/categories/:categoryName', isLoggedIn, (req, res) => {
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

/**
 * Deletes an item from the database.
 * @param {number} itemId - The ID of the item to delete.
 * @returns {Promise<Object>} A promise that resolves to an object with a success message or an error message.
 */
app.delete('/api/items/:itemId', isLoggedIn, (req, res) => {
  const itemId = req.params.itemId;

  dao.deleteItem(itemId)
    .then(() => res.status(200).json({ success: true, message: 'Item eliminato con successo' }))
    .catch((err) => res.status(err.status || 500).json({ success: false, message: err.msg || 'Errore durante l\'eliminazione dell\'item' }));
});

//------------- WISHLIST ------------

/**
 * Adds an item to the wishlist of a user.
 * @param {number} userId - The user's ID.
 * @param {number} itemId - The item's ID.
 * @param {string} visibility - The visibility of the item. Can be 'public', 'private', or 'all'.
 * @returns {Promise<Object>} A promise that resolves to an object with a success message or an error message.
 */
app.post('/api/users/:userId/wishlist', isLoggedIn, [
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

/**
 * Deletes an item from the wishlist of a user.
 * @param {number} userId - The user's ID.
 * @param {number} itemId - The item's ID.
 * @returns {Promise<Object>} A promise that resolves to an object with a success property and a message property describing the result of the operation.
 */
app.delete('/api/users/:userId/wishlist/:itemId', isLoggedIn, (req, res) => {
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

/**
 * Gets the wishlist of a user.
 * @param {number} id - The user's ID.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the wishlist items.
 */
app.get('/api/wishlist/:id', isLoggedIn, (req, res) => {
  const userId = req.params.id;
  dao.getWishlistByUserId(userId)
    .then((wishlist) => res.json(wishlist))
    .catch((error) => res.status(404).json(error));
});

/**
 * Gets the wishlist of a user filtered by visibility.
 * @param {number} id - The user's ID.
 * @param {string} visibility - The visibility of the wishlist items. Can be 'public', 'private' or 'all'.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the wishlist items with the specified visibility.
 */
app.get('/api/wishlist/:id/:visibility', isLoggedIn, (req, res) => {
  const userId = req.params.id;
  const visibility = req.params.visibility;
  dao.getWishlistByVisibility(userId, visibility)
    .then((wishlist) => res.json(wishlist))
    .catch((error) => res.status(404).json(error));
});


//------------- COMMENT ------------

/**
 * Deletes a comment from the database.
 * @param {number} commentId - The ID of the comment to delete.
 * @returns {Promise<Object>} - A promise that resolves to an object with a success property and a message property describing the result of the operation.
 */
app.delete('/api/comments/:commentId', isLoggedIn, (req, res) => {
  const commentId = req.params.commentId;
  dao.deleteComment(commentId)
    .then(() => res.status(200).json({ success: true, message: 'Commento eliminato con successo' }))
    .catch((err) => res.status(503).json({ error: err.msg || 'Database error during the item creation' }));
});

/**
 * Updates a comment in the database.
 * @param {number} idComment - The ID of the comment to update.
 * @param {string} text - The new text of the comment.
 * @returns {Promise<Object>} - A promise that resolves to an object with a success property and a message property describing the result of the operation.
 */
app.put('/api/comments/:idComment', isLoggedIn, (req, res) => {
  const idComment = req.params.idComment;
  const text = req.body.text;
  dao.updateComment(idComment, text)
    .then(() => res.status(201).json({ success: true, message: 'Commento aggiornato con successo' }))
    .catch((err) => res.status(503).json({ error: err.msg || 'Database error during the item creation' }));
}
);

/**
 * Adds a comment to the database.
 * @param {number} idUser - The ID of the user that made the comment.
 * @param {number} idItem - The ID of the item being commented.
 * @param {string} text - The text of the comment.
 * @returns {Promise<Object>} - A promise that resolves to an object with a success property and a message property describing the result of the operation.
 */
app.post('/api/comments', isLoggedIn, [
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

//------------- SEARCH ------------

/**
 * Retrieves the comments of a user by ID.
 * @param {number} userId - The ID of the user to retrieve the comments of.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the comments of the user.
 */
app.get('/api/search/users/:userId/comments', isLoggedIn, (req, res) => {
  const userId = req.params.userId;
  dao.getCommentByUserId(userId)
    .then((comments) => res.json(comments))
    .catch((error) => res.status(404).json(error));
});

/**
 * Retrieves the comments of an item by ID.
 * @param {number} itemId - The ID of the item to retrieve the comments of.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the comments of the item.
 */
app.get('/api/search/items/:itemId/comments', isLoggedIn, (req, res) => {
  const itemId = req.params.itemId;
  dao.getCommentByItemId(itemId)
    .then((comments) => res.json(comments))
    .catch((error) => res.status(404).json(error));
});

/**
 * Retrieves the comments of a user on an item by IDs.
 * @param {number} userId - The ID of the user to retrieve the comments of.
 * @param {number} itemId - The ID of the item to retrieve the comments of.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the comments of the user on the item.
 */
app.get('/api/search/users/:userId/items/:itemId/comments', isLoggedIn, (req, res) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;
  dao.getCommentByUserIdAndItemId(userId, itemId)
    .then((comments) => res.json(comments))
    .catch((error) => res.status(404).json(error));
})

/**
 * Retrieves all the comments that contain a given keyword from the database.
 * @param {string} keyword - The keyword to search in the comments.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the comments.
 */
app.get('/api/search/comments/:keyword', isLoggedIn, (req, res) => {
  const keyword = req.params.keyword;
  dao.getCommentsByKeyword(keyword)
    .then((comments) => res.json(comments))
    .catch((error) => res.status(404).json(error));
});

/**
 * Retrieves all the items of a given category and price range from the database.
 * @param {string} category - The name of the category.
 * @param {number} priceMin - The minimum price of the items.
 * @param {number} priceMax - The maximum price of the items.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing the items.
 */
app.get('/api/search/:category/:priceMin/:priceMax', isLoggedIn, (req, res) => {
  const category = req.params.category;
  const priceMin = req.params.priceMin;
  const priceMax = req.params.priceMax;
  dao.getItemsByCategoryAndPrice(category, priceMin, priceMax)
    .then((items) => res.json(items))
    .catch((error) => res.status(404).json(error));
});

//------------- OTHERS ------------

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'myapp/index.html'));
});

app.listen(port, () => console.log(`server listening at http://localhost:${port}`));