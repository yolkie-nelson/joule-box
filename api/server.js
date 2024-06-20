require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

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

// Cognito configuration
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION
});

// Middleware to verify JWT token from Cognito
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('A token is required for authentication');

  jwt.verify(token, process.env.COGNITO_POOL_ID, (err, decoded) => {
    if (err) return res.status(401).send('Invalid Token');
    req.user = decoded;
    next();
  });
};

// Import routes and pass the Redshift client
const batteryRoutes = require('./routes/battery')(client);
const userRoutes = require('./routes/user')(client);
const transactionRoutes = require('./routes/transactions')(client);
const usageRoutes = require('./routes/usage')(client);
const analyticsRoutes = require('./routes/analytics')(client);

app.use('/api/batteries', verifyToken, batteryRoutes);
app.use('/api/users', userRoutes); // user routes might include login which doesn't need token verification
app.use('/api/transactions', verifyToken, transactionRoutes);
app.use('/api/usage', verifyToken, usageRoutes);
app.use('/api/analytics', verifyToken, analyticsRoutes);

// Example route using Redshift
app.get('/api/data', verifyToken, async (req, res) => {
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
