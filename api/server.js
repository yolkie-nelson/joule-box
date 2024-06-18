require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Initialize Redshift client
const client = new Client({
  connectionString: process.env.REDSHIFT_URL,
});

client.connect()
  .then(() => console.log('Connected to Redshift'))
  .catch(err => console.error('Connection error', err.stack));

// Import routes and pass the Redshift client
const batteryRoutes = require('./routes/battery')(client);
const userRoutes = require('./routes/user')(client);
const transactionRoutes = require('./routes/transactions')(client);
const usageRoutes = require('./routes/usage')(client);
const analyticsRoutes = require('./routes/analytics')(client);

app.use('/api/batteries', batteryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/analytics', analyticsRoutes);

// Example route using Redshift
app.get('/api/data', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM your_table'); // Replace 'your_table' with your actual table name
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
