const express = require('express');
const router = express.Router();
const { Client } = require('pg');

// Initialize Redshift Client
const redshiftClient = new Client({
  connectionString: process.env.REDSHIFT_URL,
});

redshiftClient.connect();

// GET analytics data
router.get('/', async (req, res) => {
  const { battery_id, start_date, end_date } = req.query;
  try {
    const result = await redshiftClient.query(
      'SELECT * FROM analytics WHERE battery_id = $1 AND date BETWEEN $2 AND $3',
      [battery_id, start_date, end_date]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

module.exports = router;
