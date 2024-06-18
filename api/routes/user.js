const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Initialize PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET a specific user by ID
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  const { username, password_hash, role, permissions } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, role, permissions) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, password_hash, role, permissions]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT update a user by ID
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, password_hash, role, permissions } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET username = $1, password_hash = $2, role = $3, permissions = $4 WHERE id = $5 RETURNING *',
      [username, password_hash, role, permissions, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
