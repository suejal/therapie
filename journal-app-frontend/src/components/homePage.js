import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="home-container">
      <motion.div 
        className="home-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="large-pie-logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="pie-slice"></div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Therapie
        </motion.h1>
        
        <motion.p 
          className="tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          A safe space for your thoughts and feelings
        </motion.p>
        
        <motion.div 
          className="features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="feature-item">
            <div className="feature-icon">📝</div>
            <h3>Journal Daily</h3>
            <p>Track your thoughts and emotions with a simple, beautiful interface</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h3>Gain Insights</h3>
            <p>Discover patterns in your moods and emotions over time</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <h3>Private & Secure</h3>
            <p>Your journal entries are protected and only accessible by you</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="home-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Link to="/register">
            <motion.button 
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
          
          <Link to="/login">
            <motion.button 
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;