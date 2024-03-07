// imports
const express = require('express');
const morgan = require('morgan'); // logging middleware
const path = require('path');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session');

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
      userDao.getUser(username, password).then(({user, check}) => {
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


app.get('*', (req,res)=> {
res.sendFile(path.resolve(__dirname,'myapp/index.html'));
});

app.listen(port, () => console.log(`server listening at http://localhost:${port}`));