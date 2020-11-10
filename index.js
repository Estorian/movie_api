const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose')
  Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const app = express();

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});

//Middleware functions

app.use(morgan('common'));
app.use(express.static('public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('You done messed something up!');
});
app.use(bodyParser.json());

// GET requests
app.get('/', (req, res) => {
  let responseText = 'Welcome to my app!';
  res.send(responseText);
});

//return a list of all movies.
app.get('/movies', (req, res) => {
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
app.get('/movies/:name', (req, res) => {
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
app.get('/genres/:genre', (req, res) => {
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
app.get('/directors/:name', (req, res) => {
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
app.get('/users', (req, res) => {
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
app.get('/users/:username', (req, res) => {
  Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Add a new user.
/* User information will be a JSON in the format:
{
  ID: Integer,
  username: String,
  password: String,
  email: String,
  Birthday: Date
}*/
app.post('/register', (req, res) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + ' already exists.');
      } else {
        Users.create({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          Birthday: req.body.Birthday
        })
        .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Changes a user's information
app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
    $set:
      {
        username: req.body.username,
        password: req.body.password,
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
app.post('/users/:username/movies/:movieID', (req, res) => {
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
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
