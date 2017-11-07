const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const routes = require('./routes');
const bodyParser = require('body-parser');
var socketio = require('socket.io');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var server = app.listen(3000, () => {
  console.log('Listening on port 3000');
})

var io = socketio.listen(server);

app.use('/', routes(io));

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: true });
