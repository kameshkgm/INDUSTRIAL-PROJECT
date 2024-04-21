import React, { useState } from 'react';
import './index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (email === 'kameshs.21eee@kongu.edu' && password === 'industrial project') {
      window.location.href = '/Motors';
      setEmail('');
      setPassword('');
    } else {
      setError('Password doesn\'t match');
    }
  };

  return (
    
    <div className="login-container">
     
      <video autoPlay muted loop id="background-video">
        <source src="/industry.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="login-content">
        <h2>Login</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div>
          <label style={{ fontFamily: 'Arial', fontSize: '16px', fontWeight: 'bold' }}>Email:   </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontFamily: 'Arial', fontSize: '16px', fontWeight: 'bold' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div >
        <button  onClick={handleLogin}className="centre">Login</button>
      </div>
    </div>
  );
};

export default Login;
