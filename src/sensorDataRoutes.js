const express = require('express');
const SensorData = require('../models/SensorData');

const router = express.Router();

// Create a new sensor data record
router.post('/', async (req, res) => {
  try {
    const sensorData = new SensorData(req.body);
    await sensorData.save();
    res.status(201).json(sensorData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all sensor data records
router.get('/', async (req, res) => {
  try {
    const sensorData = await SensorData.find();
    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve a single sensor data record by ID
router.get('/:id', async (req, res) => {
  try {
    const sensorData = await SensorData.findById(req.params.id);
    if (!sensorData) {
      return res.status(404).json({ message: 'Sensor data not found' });
    }
    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a sensor data record by ID
router.put('/:id', async (req, res) => {
  try {
    const sensorData = await SensorData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sensorData) {
      return res.status(404).json({ message: 'Sensor data not found' });
    }
    res.json(sensorData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a sensor data record by ID
router.delete('/:id', async (req, res) => {
  try {
    const sensorData = await SensorData.findByIdAndDelete(req.params.id);
    if (!sensorData) {
      return res.status(404).json({ message: 'Sensor data not found' });
    }
    res.json({ message: 'Sensor data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
