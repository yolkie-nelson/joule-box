const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Initialize PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// GET a specific transaction by ID
router.get('/:id', async (req, res) => {
  const transactionId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [transactionId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Transaction not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// POST a new transaction
router.post('/', async (req, res) => {
  const { battery_id, user_id, date, energy_output, revenue } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transactions (battery_id, user_id, date, energy_output, revenue) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [battery_id, user_id, date, energy_output, revenue]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// PUT update a transaction by ID
router.put('/:id', async (req, res) => {
  const transactionId = req.params.id;
  const { battery_id, user_id, date, energy_output, revenue } = req.body;
  try {
    const result = await pool.query(
      'UPDATE transactions SET battery_id = $1, user_id = $2, date = $3, energy_output = $4, revenue = $5 WHERE id = $6 RETURNING *',
      [battery_id, user_id, date, energy_output, revenue, transactionId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Transaction not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// DELETE a transaction by ID
router.delete('/:id', async (req, res) => {
  const transactionId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [transactionId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Transaction not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;
