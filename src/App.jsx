import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import StaffPage from './StaffPage';
import Login from './Login';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import GateKeeper from './GateKeeper';
import TruckTransaction from './TruckTransaction';
import PlantMaster from './PlantMaster';



function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/'; // Hide only on login

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/gate" element={<GateKeeper />} />
         <Route path="/truck" element={<TruckTransaction />} />
         <Route path="/plantmaster" element={<PlantMaster />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
