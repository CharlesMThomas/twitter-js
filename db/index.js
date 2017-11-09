const pg = require('pg');
const client = new pg.Client("postgresql://localhost/twitterdb");

client.connect();

module.exports = client;
