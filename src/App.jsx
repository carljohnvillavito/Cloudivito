import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Route */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="" element={<Dashboard />} />
          </Route>
          
        </Routes>
      </main>
    </Router>
  );
}

export default App;
