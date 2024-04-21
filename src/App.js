import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Main from './Main';
import Header from './Header';
import Motors from './Motors';
function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/motors" element={<Motors/>}/>
        <Route path="/main" element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
