const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  Models = require('./models');

const cors = require('cors');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
require('./passport')

const Movies = Models.Movie;
const Users = Models.User;
const app = express();

// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true});

//Middleware functions
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1) {
      //This occurs if the requesting origin isn't found on the list of allowed origins
      let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

app.use(morgan('common'));
app.use(express.static('public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('You done messed something up!');
});
app.use(bodyParser.json());

let auth = require('./auth')(app);
require('./passport');

// GET requests
app.get('/', (req, res) => {
  let responseText = 'Welcome to my app!';
  res.send(responseText);
});

//return a list of all movies.
app.get('/movies',
  (req, res) => {
    passport.authenticate('jwt', { session: false });
    Movies.find()
      .then((movies) => {
        res.status(200).json(movies)
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//return details about a specific movie
app.get('/movies/:name',
  (req, res) => {
    passport.authenticate('jwt', { session: false });
    Movies.find({ Title: req.params.name })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//return all movies of a specific genre
app.get('/genres/:genre',
  (req, res) => {
    passport.authenticate('jwt', { session: false });
    Movies.find({ "Genre.Name": req.params.genre })
      .then((genre) => {
        res.status(201).json(genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

// Return information on a specific director
app.get('/directors/:name',
  (req, res) => {
    passport.authenticate('jwt', { session: false }),
    Movies.findOne({ "Director.Name": req.params.name })
      .then((movie) => {
        res.status(200).json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});


//return all user data
app.get('/users',
  (req, res) => {
     passport.authenticate('jwt', { session: false });
     Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

// get a user by username
app.get('/users/:username',
  (req, res) => {
    passport.authenticate('jwt', { session: false });
    Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Register a new user.
/* User information will be a JSON in the format:
{
  ID: Integer,
  username: String,
  password: String,
  email: String,
  Birthday: Date
}*/
app.post('/users',
  [
    check('username', 'Username must be at least 5 characters').isLength({min:5}),
    check('username', 'Username must contain only alphanumeric characters (A-Z, 0-9).').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email is not valid').isEmail()
  ],
  (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);
    Users.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + ' already exists.');
        } else {
          Users.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error + '<br>Could not create user.');
          });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error + '<br>Could not look up username.');
      });
});

//Changes a user's information
app.put('/users/:username',
  [
    check('username', 'Username must be at least 5 characters').isLength({min:5}),
    check('username', 'Username must contain only alphanumeric characters (A-Z, 0-9).').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email is not valid').isEmail()
  ],
  (req, res) => {
    passport.authenticate('jwt', { session: false });
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);



    Users.findOneAndUpdate({ username: req.params.username }, {
      $set:
        {
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          Birthday: req.body.Birthday
        }
      },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//    Allows users to add a movie to their list of favorites
app.put('/users/:username/movies/:movieID', (req, res) => {
  passport.authenticate('jwt', { session: false });
  Users.findOneAndUpdate({ username: req.params.username }, {
    $push: { favoriteMovies: req.params.movieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//    Allows users to remove a movie from their list of favorites.
app.delete('/users/:username/movies/:movieID/remove', (req, res) => {
  passport.authenticate('jwt', { session: false });
  Users.findOneAndUpdate({ username: req.params.username }, {
    $pull: { favoriteMovies: req.params.movieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err),
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//    Allows users to deregister.
app.delete('/users/:username', (req, res) => {
  passport.authenticate('jwt', { session: false }),
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found.');
      } else {
        res.status(200).send(req.params.username + ' was deleted.')
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//listen for requests
// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
