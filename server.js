"use strict";

// imports
const express = require('express');
const morgan = require('morgan'); // logging middleware
const path = require('path');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session');
//const FileStore = require('session-file-store')(session); serve per non salvare i dati della sessione nella memoria del server ma altrove
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
    function(username, password, done) {
      dao.getUser(username, password).then(({user, check}) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!check) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      })
    }
  ));

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  dao.getUserById(id).then(user => {
    done(null, user);
  });
});

// check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
      return next();
  }
  return res.status(401).json({"statusCode" : 401, "message" : "not authenticated"});
}

// set up the session
app.use(session({
  //store: new FileStore(), // by default, Passport uses a MemoryStore to keep track of the sessions - if you want to use this, launch nodemon with the option: --ignore sessions/
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false,
  // removing the following line will cause a browser's warning, since session cookie
  // cross-site default policy is currently not recommended
  cookie: { sameSite: 'lax' }
}));

// POST /users
// Sign up
app.post('/api/users', /* [add here some validity checks], */ (req, res) => {
  // create a user object from the signup form
  // additional fields may be useful (name, role, etc.)
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  dao.createUser(user)
  .then((result) => res.status(201).header('Location', `/users/${result}`).end())
  .catch((err) => res.status(503).json({ error: 'Database error during the signup'}));
});

// POST /sessions 
// Login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, function(err) {
        if (err) { return next(err); }
        // req.user contains the authenticated user
        return res.json(req.user.username);
      });
  })(req, res, next);
});

// GET /items
app.get('/api/items', (req,res)=>{
  dao.getAllItems()
  .then( items => res.json(items))
  .catch( error => res.status(500).json(error));
});


app.get('*', (req,res)=> {
res.sendFile(path.resolve(__dirname,'myapp/index.html'));
});

app.listen(port, () => console.log(`server listening at http://localhost:${port}`));