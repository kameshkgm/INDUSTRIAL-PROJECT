import React, { useState } from 'react';
import './index.css';

const Motors = () => {
  const [showPicture, setShowPicture] = useState(false);

  const handleClick = () => {
    setShowPicture(true);
    setTimeout(() => {
      setShowPicture(false);
      window.location.href = '/Main';
    }, 10000);
  };

  return (
    <div className="motors-container">
      <div className="box-container">
        <h2 style={{ fontFamily: 'Algerian', fontSize: '24px', marginBottom: '20px' }}>Select a motor to monitor</h2>
        <button className="motor-button" type="button" onClick={handleClick}>Motor 1</button><br/>
        <button className="motor-button" type="button" onClick={handleClick}>Motor 2</button><br/>
        <button className="motor-button" type="button" onClick={handleClick}>Motor 3</button>
      </div>
      {showPicture && (
        <div className="overlay" onClick={() => setShowPicture(false)}>
          <div className="popup">
            <img className="popup-image" src={'/spec.jpg'} alt="Motor Spec" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Motors;
