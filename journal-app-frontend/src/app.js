import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './app.css';
import HomePage from './components/homePage';
import Login from './components/login';
import Register from './components/register';
import Journal from './components/journal'; 
import JournalEntry from './components/journalEntry';
import Insights from './components/insights';
import Navbar from './components/navbar';
import { AuthProvider } from './context/authContext';
import PrivateRoute from './components/privateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/journal" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Journal />
                </>
              </PrivateRoute>
            } />
            <Route path="/entry/:id?" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <JournalEntry />
                </>
              </PrivateRoute>
            } />
            <Route path="/insights" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Insights />
                </>
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;