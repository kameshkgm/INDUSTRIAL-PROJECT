const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors module

const app = express();
const PORT = process.env.PORT || 5000; // Choose any port you prefer

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myDatabase')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const sensorDataSchema = new mongoose.Schema({
    temperature: Number,
    current: Number,
    speed: Number,
    vibration: Number
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

app.post('/sensor-data', async (req, res) => {
    const { temperature, current, speed, vibration } = req.body;
    try {
        const newSensorData = new SensorData({ temperature, current, speed, vibration });
        await newSensorData.save();
        res.status(201).json(newSensorData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});