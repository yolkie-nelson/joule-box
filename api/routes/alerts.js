const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Initialize PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET all alerts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alerts');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// GET a specific alert by ID
router.get('/:id', async (req, res) => {
  const alertId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM alerts WHERE id = $1', [alertId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Alert not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
});

// POST a new alert
router.post('/', async (req, res) => {
  const { date, severity, battery_id, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO alerts (date, severity, battery_id, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [date, severity, battery_id, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// PUT update an alert by ID
router.put('/:id', async (req, res) => {
  const alertId = req.params.id;
  const { date, severity, battery_id, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE alerts SET date = $1, severity = $2, battery_id = $3, description = $4 WHERE id = $5 RETURNING *',
      [date, severity, battery_id, description, alertId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Alert not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// DELETE an alert by ID
router.delete('/:id', async (req, res) => {
  const alertId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM alerts WHERE id = $1 RETURNING *', [alertId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Alert not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

module.exports = router;
