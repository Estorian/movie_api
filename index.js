const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose')
  Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const app = express();

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});

let users = [
  {
    username: 'Estorian',
    firstName: 'Jason',
    lastName: 'Lee',
    email: 'stuff@stuff.com',
  }
]

let topMovies = [
  {
    title: 'Hook',
    description: 'When Captain James Hook kidnaps his children, an adult Peter Pan must return to Neverland and reclaim his youthful spirit in order to challenge his old enemy.',
    genre: 'Adventure',
    director: 'Steven Spielberg',
    imageurl: 'https://m.media-amazon.com/images/M/MV5BNmJjNTQzMjctMmE2NS00ZmYxLWE1NjYtYmRmNjNiMzljOTc3XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_UX182_CR0,0,182,268_AL_.jpg',
    featured: 'true'
  },
  {
    title: 'What Dreams May Come',
    description: 'Chris Nielsen dies in an accident, and enters Heaven. But when he discovers that his beloved wife Annie has killed herself out of grief over the loss, he embarks on an afterlife adventure to reunite with her.',
    genre: 'Drama',
    director: 'Vincent Ward',
    imageurl: 'https://m.media-amazon.com/images/M/MV5BNTg5ZWRjNTctNmMyMi00NTJmLTg3YjktMzJlMDRiYWQ0MjMzL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX182_CR0,0,182,268_AL_.jpg',
    featured: 'false'
  },
  {
    title: 'Dead Poets Society',
    description: 'Maverick teacher John Keating uses poetry to embolden his boarding school students to new heights of self-expression.',
    genre: 'Drama',
    director: 'Peter Weir',
    imageurl: 'https://m.media-amazon.com/images/M/MV5BOGYwYWNjMzgtNGU4ZC00NWQ2LWEwZjUtMzE1Zjc3NjY3YTU1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX182_CR0,0,182,268_AL_.jpg',
    featured: 'false'
  },
  {
    title: 'The Fountain',
    description: 'As a modern-day scientist, Tommy is struggling with mortality, desperately searching for the medical breakthrough that will save the life of his cancer-stricken wife, Izzi.',
    genre: 'Drama',
    director: 'Darren Aronofsky',
    imageurl: 'https://m.media-amazon.com/images/M/MV5BMTU5OTczMTcxMV5BMl5BanBnXkFtZTcwNDg3MTEzMw@@._V1_UX182_CR0,0,182,268_AL_.jpg',
    featured: 'false'
  },
  {
    title: 'Thor: Ragnarok',
    description: 'Imprisoned on the planet Sakaar, Thor must race against time to return to Asgard and stop Ragnarök, the destruction of his world, at the hands of the powerful and ruthless villain Hela.',
    genre: 'Action',
    director: 'Taika Waititi',
    imageurl: 'https://m.media-amazon.com/images/M/MV5BMjMyNDkzMzI1OF5BMl5BanBnXkFtZTgwODcxODg5MjI@._V1_UX182_CR0,0,182,268_AL_.jpg',
    featured: 'false'
  },
  {
    title: 'Back to the Future Part II',
    description: 'After visiting 2015, Marty McFly must repeat his visit to 1955 to prevent disastrous changes to 1985...without interfering with his first trip.',
    genre: 'Adventure',
    director: 'Robert Zemeckis',
    imageurl: 'https://m.media-amazon.com/images/M/MV5BZTMxMGM5MjItNDJhNy00MWI2LWJlZWMtOWFhMjI5ZTQwMWM3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX182_CR0,0,182,268_AL_.jpg',
    featured: 'false'
  },
  {
    title: 'States of Grace',
    description: 'The lives of a street preacher, an aspiring actress, a Mormon missionary, and a young gang banger intersect in this ensemble drama set in present-day Santa Monica, California.',
    genre: 'Drama',
    director: 'Richard Dutcher',
    imageurl: 'https://m.media-amazon.com/images/M/MV5BMjEwNjg3NTE3OV5BMl5BanBnXkFtZTcwOTk1MzIzMQ@@._V1_UY268_CR0,0,182,268_AL_.jpg',
    featured: 'false'
  },
  {
    title: 'The Princess Bride',
    description: 'While home sick in bed, a young boy\'s grandfather reads him the story of a farmboy-turned-pirate who encounters numerous obstacles, enemies and allies in his quest to be reunited with his true love.',
    genre: 'Adventure',
    director: 'Rob Reiner',
    imageurl: 'https://m.media-amazon.com/images/M/MV5BMGM4M2Q5N2MtNThkZS00NTc1LTk1NTItNWEyZjJjNDRmNDk5XkEyXkFqcGdeQXVyMjA0MDQ0Mjc@._V1_UX182_CR0,0,182,268_AL_.jpg',
    featured: 'false'
  },
  {
    title: 'Signs',
    description: 'A family living on a farm finds mysterious crop circles in their fields which suggests something more frightening to come.',
    genre: 'Drama',
    director: 'M. Night Shyamalan',
    imageurl: 'https://m.media-amazon.com/images/M/MV5BNDUwMDUyMDAyNF5BMl5BanBnXkFtZTYwMDQ3NzM3._V1_UX182_CR0,0,182,268_AL_.jpg',
    featured: 'false'
  },
  {
    title: 'Hero',
    description: 'A defense officer, Nameless, was summoned by the King of Qin regarding his success of terminating three warriors.',
    genre: 'Adventure',
    director: 'Yimou Zhang',
    imageurl: 'https://m.media-amazon.com/images/M/MV5BMWQ2MjQ0OTctMWE1OC00NjZjLTk3ZDAtNTk3NTZiYWMxYTlmXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX182_CR0,0,182,268_AL_.jpg',
    featured: 'false'
  }
];

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
//
//   res.json(topMovies.find((movie) =>
//   { return movie.title === req.params.name} ));
// });

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
  // let genreMovies = topMovies.filter((movie) =>
  //   { return movie.genre === req.params.genre });
  // res.json(genreMovies);
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

  // res.send('No list of directors exists in the database yet, but the request was successful.')
  // res.json(directors.find((director) =>
  //   { return director.name === req.params.name }));
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
  // let newUser = req.body;
  //
  // if (!newUser.username) {
  //   const message = 'Missing username in request body.'
  //   res.status(400).send(message);
  // } else {
  //   let message = 'Successfully added user '
  //   users.push(newUser);
  //   res.status(201).send(message + newUser.username);
  // }
});

//Changes a user's username
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
//
//
//   let user = users.find((user) =>
//     { return user.username === req.params.userName});
//   if (!user)  {
//     let message = 'No such user.'
//     res.status(404).send(message);
//   } else {
//   user.userName = req.params.newUserName;
//   let message = "User " + req.params.userName + "has changed their username to " + user.userName;
//   res.send(message);
//   }
// });

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
  //
  //
  //
  //
  // let user = users.find((user) =>
  //   { return user.userName === req.params.username});
  // let movie = topMovies.find((movie) =>
  //   { return movie.title === req.params.movieName });
  // if (!user)  {
  //   let message = 'No such user.';
  //   res.status(404).send(message);
  // } else if (!movie) {
  //   let message = 'No such movie in database.';
  //   res.status(404).send(message);
  // } else {
  //   user.favorites.push(movie);
  //   res.status(201).send(movie);
  // }
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
//
//
//   let user = users.find((user) =>
//     { return user.userName === req.params.username});
//   let movie = topMovies.find((movie) =>
//     { return movie.title === req.params.movieName });
//   if (!user)  {
//     let message = 'No such user.';
//     res.status(404).send(message);
//   } else if (!movie) {
//     let message = 'No such movie in database.';
//     res.status(404).send(message);
//   } else {
//     user.favorites = user.favorites.filter((obj) =>
//       { return obj.title !== req.params.movieName});
//     let message = req.params.movieName + ' was removed from ' + req.param.username + '\'s favorites list';
//     res.status(201).send(message);
//   }
// });

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



  // let user = users.find((user) =>
  //   { return user.username === req.params.username });
  //
  // if (user) {
  //   users = users.filter((obj) =>
  //     { return obj.username !== req.params.username });
  //   res.status(201).send('User ' + req.params.username + ' was deleted.');
  // }
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
