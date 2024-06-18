const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// Initialize MongoDB
const mongoClient = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// POST new usage data
router.post('/', async (req, res) => {
  const usageData = req.body;
  try {
    await mongoClient.connect();
    const database = mongoClient.db();
    const collection = database.collection('usage_patterns');
    const result = await collection.insertOne(usageData);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add usage data' });
  } finally {
    await mongoClient.close();
  }
});

module.exports = router;
