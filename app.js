const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const routes = require('./routes');

app.use(express.static('public'));

app.use('/', routes);

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: true });

app.use('/', (req, res) => {
  console.log(`${req.method} ${req.url} ${req.statusCode}`);

  const people = [{name: 'Full'}, {name: 'Stacker'}, {name: 'Son'}];
  res.render( 'index', {title: 'Hall of Fame', people: people} );
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
})
