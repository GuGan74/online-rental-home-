
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import PropertyDetailsPage from '@/pages/PropertyDetailsPage';
import { getUser, logoutUser } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import AdminDashboard from './pages/AdminDashboard';
// import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(getUser());

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-cyan-400 text-foreground">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <Routes>
            <Route path="/a" element={<AdminDashboard/>}/>
              <Route path="/home" element={
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HomePage />
                </motion.div>
              } />
              <Route path="/" element={
                user ? <Navigate to="/" /> :
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginPage onLogin={handleLogin} />
                </motion.div>
              } />
              <Route path="/register" element={
                user ? <Navigate to="/" /> :
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegisterPage onRegister={handleLogin} />
                 </motion.div>
              } />
              <Route path="/property/:id" element={
                <motion.div
                  key="property-details"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <PropertyDetailsPage />
                </motion.div>
               } />
               {/* Add more routes as needed */}
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
  