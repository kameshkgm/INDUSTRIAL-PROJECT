const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  temperature: Number,
  current: Number,
  speed: Number,
  vibration: Number,
  timestamp: { type: Date, default: Date.now },
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
