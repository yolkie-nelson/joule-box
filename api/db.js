const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.REDSHIFT_URL,
});

client.connect()
  .then(() => console.log('Connected to Redshift'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = client;
