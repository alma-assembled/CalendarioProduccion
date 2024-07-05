import React from 'react';
import './App.css';
import EventCalendar from './componets/EventCalendar/EventCalendar';
import ResumenEvent from './pages/ResumenEvent/ResumenEvent'
import { Routes, Route, BrowserRouter as Router, } from 'react-router-dom'

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
          <Route path="/" element={<EventCalendar />} />
          <Route path="/resumen" element={<ResumenEvent />} />
      </Routes>
    </div>
    </Router>
    
  );
}

export default App;
