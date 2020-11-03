const express = require('express');
const app = express();
const morgan = require('morgan');

let topMovies = [
  {
    title: 'Hook',
    director: 'Steven Spielberg',
    starring: ['Robin Williams', 'Dustin Hoffman']
  },
  {
    title: 'What Dreams May Come',
    director: 'Vincent Ward',
    starring: ['Robin Williams', 'Cuba Gooding Jr.']
  },
  {
    title: 'Dead Poets Society',
    director: 'Peter Weir',
    starring: ['Robin Williams', 'Robert Sean Leonard']
  },
  {
    title: 'The Fountain',
    director: 'Darren Aronofsky',
    starring: ['Hugh Jackman', 'Rachel Weisz']
  },
  {
    title: 'Thor: Ragnarok',
    director: 'Taika Waititi',
    starring: ['Chris Hemsworth', 'Tom Hiddleston', 'Cate Blanchett']
  },
  {
    title: 'Back to the Future Part II',
    director: 'Robert Zemeckis',
    starring: ['Michael J. Fox', 'Christopher Lloyd']
  },
  {
    title: 'States of Grace',
    director: 'Richard Dutcher',
    starring: ['Ignacio Serricchio', 'Lucas Fleischer', 'Lamont Stephens']
  },
  {
    title: 'The Princess Bride',
    director: 'Rob Reiner',
    starring: ['Cary Elwes', 'Mandy Patinkin', 'Robin Wright']
  },
  {
    title: 'Signs',
    director: 'M. Night Shyamalan',
    starring: ['Mel Gibson', 'Joaquin Phoenix']
  },
  {
    title: 'Hero',
    director: 'Yimou Zhang',
    starring: ['Jet Li', 'Tony Chiu-Wai Leung', 'Maggie Cheung']
  }
];

//Middleware functions

app.use(morgan('common'));
app.use(express.static('public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('You done messed something up!');
});

// GET requests
app.get('/', (req, res) => {
  let responseText = 'Welcome to my app!';
  res.send(responseText);
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
