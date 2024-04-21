import React, { useEffect, useState, useRef } from 'react';
import mqtt from 'mqtt';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReactSpeedometer from "react-d3-speedometer";

const Main = () => {
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [currentHistory, setCurrentHistory] = useState([]);
  const [powerHistory, setPowerHistory] = useState([]); // State to hold power consumed over time
  const [speed, setSpeed] = useState(0);
  const [vibration, setVibration] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [client, setClient] = useState(null);

  const temperatureChartRef = useRef(null);
  const currentChartRef = useRef(null);

  useEffect(() => {
    const mqttOption = {
      clientId: 'web-client-' + Math.random().toString(16).substr(2, 8),
    };
    const host = 'ws://192.168.137.1:8083/mqtt';
    const mqttClient = mqtt.connect(host, mqttOption);
    setClient(mqttClient);

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  useEffect(() => {
    if (client) {
      client.subscribe('sensor_data');
      client.on('message', handleMessage);
    }

    return () => {
      if (client) {
        client.removeListener('message', handleMessage);
      }
    };
  }, [client]);

  const handleMessage = (topic, message) => {
    const payload = JSON.parse(message.toString());
    sendSensorData(payload);
    setTemperatureHistory(prevHistory => [...prevHistory, payload.temperature]);
    setCurrentHistory(prevHistory => [...prevHistory, payload.current]);
    setSpeed(payload.speed); // Directly set speed
    setVibration(payload.vibration); // Directly set vibration

    // Calculate power consumed
    const power = payload.current * 230; // Assuming motor voltage is 230V
    setPowerHistory(prevHistory => [...prevHistory, power]);

    const newAlerts = [];

    if (payload.vibration === 1) {
      newAlerts.push("High Vibration Alert! Your machine is experiencing high vibration.");
    }
    if (payload.current > 5) {
      newAlerts.push("High Current Alert! Current exceeds 5 Amps.");
    }
    if (payload.temperature > 90) {
      newAlerts.push("High Temperature Alert! Temperature exceeds 90°C.");
    }
    if (payload.speed > 1400) {
      newAlerts.push("High Speed Alert! Speed exceeds 1400 RPM.");
    }

    setAlerts(newAlerts);
    sendAlerts(newAlerts);
  };

  const sendAlerts = async (newAlerts) => {
    if (newAlerts.length > 0) {
      try {
        const response = await axios.post('/send-message', { body: newAlerts.join(' ') });
        console.log(response.data);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    } else {
      console.log("No alert message to send.");
    }
  };

  const sendSensorData = async (payload) => {
    try {
      const response = await axios.post('http://localhost:5000/sensor-data', payload); // Assuming backend is running on port 5000
      console.log(response.data);
    } catch (error) {
      console.error('Failed to send sensor data:', error);
    }
  };

  const AlertMessage = ({ alerts }) => (
    <div className="overlay1">
      <div className="popup1">
        <h2>Alert!</h2>
        {alerts.map((alert, index) => (
          <p key={index}>{alert}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="main-container">
      {alerts.length > 0 && <AlertMessage alerts={alerts} />}
      <div className="chart-container" id="temperature-chart-container">
        <h3 className="chart-heading">Temperature vs Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={temperatureHistory.map((value, index) => ({ time: index, temperature: value }))}>
            <XAxis dataKey="time" />
            <YAxis />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#FF5733" name="Temperature (°C)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container" id="current-chart-container">
        <h3 className="chart-heading">Current vs Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={currentHistory.map((value, index) => ({ time: index, current: value }))}>
            <XAxis dataKey="time" />
            <YAxis />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="current" stroke="#3366FF" name="Current (A)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container" id="power-chart-container">
        <h3 className="chart-heading">Power Consumed vs Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={powerHistory.map((value, index) => ({ time: index, power: value }))}>
            <XAxis dataKey="time" />
            <YAxis />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="power" stroke="#FFA500" name="Power (W)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container" id="speedometer-chart-container">
        <h3 className="chart-heading">Speedometer Gauge</h3>
        <div className="gauge-container">
          <ReactSpeedometer
            value={speed}
            needleColor="steelblue"
            needleTransitionDuration={4000}
            needleTransition="easeElastic"
            textColor={(vibration === 0 || speed > 1500) ? 'red' : 'black'}
          />
          <p>{speed} RPM</p>
        </div>
      </div>

      <div className="vibration-container" id="vibration-container">
        <h3 className="chart-heading">Vibration</h3>
        <p>{vibration === 1 ? 'High' : 'Low'}</p>
      </div>
    </div>
  );
};

export default Main;
