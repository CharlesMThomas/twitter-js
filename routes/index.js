const express = require('express');
var path = require('path');
const router = express.Router();
const tweetBank = require('../tweetBank');

module.exports = function (io) {

  router.get('/', function (req, res) {
    let tweets = tweetBank.list();
    res.render( 'index', { tweets: tweets, showForm: true } );
  });

  router.get('/users/:name', function(req, res) {
      var name = req.params.name;
      var tweets = tweetBank.find( {name: name} );
      res.render( 'index', { tweets: tweets, showForm: true, name: name } );
    });

  router.get('/tweets/:id', function(req, res){
      var id = parseInt(req.params.id, 10);
      var tweets = tweetBank.find({id: id});
      res.render('index', {tweets: tweets});
  });

  router.post('/tweets', function(req, res) {
    var name = req.body.name;
    var text = req.body.text;
    io.sockets.emit('newTweet', tweetBank.add(name, text));
    res.redirect('/');
  });

  return router;
}

