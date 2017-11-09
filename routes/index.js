const express = require('express');
var path = require('path');
const router = express.Router();
const tweetBank = require('../tweetBank');
const client = require('../db');



module.exports = function (io) {

  router.get('/', function (req, res, next) {
    client.query('SELECT name, picture_url, tweets.id as id, content FROM users, tweets WHERE users.id = tweets.user_id', function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  });

  router.get('/users/:name', function(req, res, next) {
    client.query('SELECT name, picture_url, tweets.id as id, content FROM users, tweets WHERE users.id = tweets.user_id AND users.name=$1', [req.params.name], function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true, name: tweets.name });
    });
  });

  router.get('/tweets/:id', function(req, res, next){
    client.query('SELECT name, picture_url, tweets.id as id, content FROM users, tweets WHERE users.id = tweets.user_id AND tweets.id=$1', [req.params.id], function (err, result) {
      if (err) return next(err); // pass errors to Express
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets});
    });
  });

  router.post('/tweets', function(req, res, next) {
    var name = req.body.name;
    var text = req.body.text;
    var picture_url = "https://pbs.twimg.com/profile_images/2450268678/olxp11gnt09no2y2wpsh_normal.jpeg";

    client.query('SELECT id FROM users WHERE name=$1', [name], function (err, result) {
      if (err) return next(err); // pass errors to Express
      if (result.rowCount) {

        var user_id = result.rows[0].id;

        client.query('INSERT INTO tweets (user_id, content) VALUES ($1, $2) RETURNING *', [user_id, text], function (err, result) {
          if (err) return next(err); // pass errors to Express

          client.query('SELECT * FROM users, tweets WHERE users.id = tweets.user_id AND users.id=$1 AND tweets.content=$2',[user_id, text], function (err, result) {
            if (err) return next(err);
            io.sockets.emit('newTweet', result.rows[0]);
          });

        });

      } else {

        client.query('INSERT INTO users (name, picture_url) VALUES ($1, $2) RETURNING id', [name, picture_url], function (err, result) {
          if (err) return next(err);
          var user_id = result.rows[0].id;

          client.query('INSERT INTO tweets (user_id, content) VALUES ($1, $2) RETURNING *', [user_id, text], function (err, result) {
            if (err) return next(err); // pass errors to Express

            client.query('SELECT * FROM users, tweets WHERE users.id = tweets.user_id AND users.id=$1 AND tweets.content=$2',[user_id, text], function (err, result) {
              if (err) return next(err);
              io.sockets.emit('newTweet', result.rows[0]);
            });

          });

        });

      }
    });

    res.redirect('/');
  });

  return router;
}

