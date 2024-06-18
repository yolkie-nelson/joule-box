const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const AWS = require('aws-sdk');

// Initialize MongoDB
const mongoClient = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ endpoint: process.env.DYNAMODB_ENDPOINT });

// Initialize Redshift
module.exports = (client) => {
  // GET all batteries
  router.get('/', async (req, res) => {
    try {
      // Example: Fetch from Redshift
      const result = await client.query('SELECT * FROM batteries');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch batteries' });
    }
  });

  // GET a specific battery by ID
  router.get('/:id', async (req, res) => {
    const batteryId = req.params.id;
    try {
      // Example: Fetch from MongoDB
      await mongoClient.connect();
      const database = mongoClient.db('your-database');
      const collection = database.collection('batteries');
      const battery = await collection.findOne({ id: batteryId });

      if (!battery) {
        return res.status(404).json({ message: 'Battery not found' });
      }
      res.json(battery);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch battery' });
    } finally {
      await mongoClient.close();
    }
  });

  // POST a new battery
  router.post('/', async (req, res) => {
    const newBattery = req.body;
    try {
      // Example: Insert into DynamoDB
      const params = {
        TableName: 'BatteriesTable',
        Item: newBattery,
      };
      await dynamoDB.put(params).promise();
      res.status(201).json(newBattery);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create battery' });
    }
  });

  // PUT update a battery by ID
  router.put('/:id', async (req, res) => {
    const batteryId = req.params.id;
    const updatedBattery = req.body;
    try {
      // Example: Update in Redshift
      const result = await client.query(
        'UPDATE batteries SET location = $1, capacity = $2, chargeLevel = $3, healthStatus = $4 WHERE id = $5 RETURNING *',
        [updatedBattery.location, updatedBattery.capacity, updatedBattery.chargeLevel, updatedBattery.healthStatus, batteryId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Battery not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update battery' });
    }
  });

  // DELETE a battery by ID
  router.delete('/:id', async (req, res) => {
    const batteryId = req.params.id;
    try {
      // Example: Delete from Redshift
      const result = await client.query('DELETE FROM batteries WHERE id = $1 RETURNING *', [batteryId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Battery not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete battery' });
    }
  });

  return router;
};
