import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';

const FloatingPie = ({ size, delay, duration, initialX, initialY, color }) => {
  const pathX = Array(5).fill().map(() => Math.random() * 100 - 50);
  const pathY = Array(5).fill().map(() => Math.random() * 100 - 50);
  
  return (
    <motion.div
      className="floating-pie"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'fixed', 
        background: color,
        opacity: 0.4,
        zIndex: -1,
        top: initialY + '%',
        left: initialX + '%',
        pointerEvents: 'none' 
      }}
      animate={{ 
        x: pathX,
        y: pathY,
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        delay: delay,
        ease: "easeInOut"
      }}
    />
  );
};

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('entries');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/journal');
      console.log('API response:', response.data);

      const entries = Array.isArray(response.data) ? response.data : [];
      
      const sortedEntries = entries.sort((a, b) => 
        new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      );

      console.log('Processed entries:', sortedEntries);
      setEntries(sortedEntries);
      setLoading(false);

    } catch (err) {
      console.error('Error fetching entries:', err);
      setEntries([]);  
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      fetchEntries();
    };
  
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [location.pathname]);
  
  useEffect(() => {
    if (location.state?.refreshEntries) {
      fetchEntries();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleDeleteEntry = async (id) => {
    if (!id) {
      console.error('Cannot delete entry without ID:', id);
      return;
    }
    
    if (deletingId === id) {
      try {
        console.log('Deleting entry with ID:', id);
        await api.delete(`/api/journal/${id}`);
        
        setEntries(prevEntries => prevEntries.filter(entry => entry._id !== id));
        setDeletingId(null); 

      } catch (err) {
        console.error('Error deleting entry:', err.response || err);
        setError(`Failed to delete entry: ${err.message}`);
        setDeletingId(null); 
      }
    } else {
      setDeletingId(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const pastelColors = [
    'linear-gradient(135deg, #FFD6E0, #FFACC7)', 
    'linear-gradient(135deg, #D0EBFF, #A5D8FF)', 
    'linear-gradient(135deg, #C3FAE8, #96F2D7)', 
    'linear-gradient(135deg, #FFF3BF, #FFE066)', 
    'linear-gradient(135deg, #E5DBFF, #C0A0FF)', 
    'linear-gradient(135deg, #FFE2DD, #FFBDAD)'  
  ];
  
  const pieElements = [];
  for (let i = 0; i < 20; i++) { 
    pieElements.push(
      <FloatingPie 
        key={i}
        size={`${Math.random() * 120 + 60}px`} 
        delay={i * 0.3}
        duration={Math.random() * 40 + 60} 
        initialX={Math.random() * 100}
        initialY={Math.random() * 100}
        color={pastelColors[Math.floor(Math.random() * pastelColors.length)]}
      />
    );
  }

  const customStyles = {
    tabButton: {
      background: 'transparent',
      border: '1px solid #ccc',
      padding: '8px 16px',
      margin: '0 8px',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    activeTabButton: {
      background: '#f0f0f0',
      border: '1px solid #999'
    },
    newEntryButton: {
      fontSize: '0.9rem',
      padding: '8px 16px',
      borderRadius: '20px'
    }
  };

  const hasEntries = Array.isArray(entries) && entries.length > 0 && entries.some(entry => entry);

  return (
    <div className="home-container">
      {pieElements}
      
      <motion.div 
        className="home-content journal-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="journal-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <h1>My Journal</h1>
          <motion.button
            className="btn-primary"
            onClick={() => navigate('/entry')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={customStyles.newEntryButton}
          >
            <span>+</span> New Entry
          </motion.button>
        </motion.div>

        <motion.div 
          className="tabs-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ marginBottom: '20px', textAlign: 'center' }}
        >
          <motion.button
            style={{
              ...customStyles.tabButton,
              ...(activeTab === 'entries' ? customStyles.activeTabButton : {})
            }}
            onClick={() => setActiveTab('entries')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Journal Entries
          </motion.button>
          <motion.button
            style={{
              ...customStyles.tabButton,
              ...(activeTab === 'moods' ? customStyles.activeTabButton : {})
            }}
            onClick={() => setActiveTab('moods')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Mood Analysis
          </motion.button>
        </motion.div>

        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: 'red', marginBottom: '20px' }}
          >
            {error}
          </motion.div>
        )}
        
        {activeTab === 'entries' ? (
          loading ? (
            <motion.div 
              className="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ textAlign: 'center', padding: '40px 0' }}
            >
              <motion.div
                className="loading-pie"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%',
                  background: pastelColors[0],
                  margin: '0 auto 20px'
                }}
              />
              <p>Loading entries...</p>
            </motion.div>
          ) : !hasEntries ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ 
                textAlign: 'center', 
                padding: '60px 0',  
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <p style={{ 
                fontSize: '1.1rem',
                color: '#666' 
              }}>
                You haven't created any journal entries yet.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="entries-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ display: 'grid', gap: '20px' }}
            >
              {Array.isArray(entries) && entries.map((entry, index) => (
                <motion.div 
                  key={entry._id}
                  className="entry-card feature-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  style={{ 
                    padding: '20px', 
                    borderRadius: '10px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    background: 'white'
                  }}
                >
                  <div className="entry-header" style={{ marginBottom: '10px' }}>
                    <h3>{entry.title || 'Untitled Entry'}</h3>
                    <div className="entry-date" style={{ color: '#666', fontSize: '0.9rem' }}>
                      {formatDate(entry.createdAt || entry.date)}
                    </div>
                  </div>
                  <div className="entry-mood" style={{ marginBottom: '10px' }}>
                    <span 
                      className={`mood-tag mood-${(entry.mood || 'calm').toLowerCase()}`}
                      style={{ 
                        padding: '4px 10px', 
                        borderRadius: '15px', 
                        background: '#f0f0f0',
                        fontSize: '0.8rem'
                      }}
                    >
                      {entry.mood || 'Calm'}
                    </span>
                  </div>
                  <div className="entry-content" style={{ marginBottom: '20px' }}>
                    {entry.content && entry.content.length > 150 
                      ? `${entry.content.substring(0, 150)}...` 
                      : entry.content || 'No content'}
                  </div>
                  <div className="entry-actions" style={{ display: 'flex', gap: '10px' }}>
                    <motion.button
                      onClick={() => navigate(`/entry/${entry._id}`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ 
                        background: '#2a2a2a', 
                        color: 'white', 
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteEntry(entry._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ 
                        background: deletingId === entry._id ? '#ff4444' : 'transparent', 
                        color: deletingId === entry._id ? 'white' : '#2a2a2a', 
                        border: '1px solid ' + (deletingId === entry._id ? '#ff4444' : '#2a2a2a'),
                        padding: '6px 14px',
                        borderRadius: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      {deletingId === entry._id ? 'Confirm Delete' : 'Delete'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )
        ) : (
          <motion.div 
            className="mood-analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="analysis-content">
              <h3 style={{ marginBottom: '10px' }}>Your Mood Patterns</h3>
              <p style={{ marginBottom: '20px', color: '#666' }}>Tracking your emotional journey over time</p>
              
              <div className="analysis-sections" style={{ display: 'grid', gap: '20px' }}>
                <div className="analysis-section feature-item" style={{ 
                  padding: '20px', 
                  borderRadius: '10px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  background: 'white'
                }}>
                  <h4 style={{ marginBottom: '10px' }}>Weekly Overview</h4>
                  <div className="placeholder-chart" style={{ 
                    height: '180px', 
                    background: '#f5f5f5', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div className="chart-message" style={{ color: '#888' }}>Weekly mood data will appear here</div>
                  </div>
                </div>
                
                <div className="analysis-section feature-item" style={{ 
                  padding: '20px', 
                  borderRadius: '10px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  background: 'white'
                }}>
                  <h4 style={{ marginBottom: '10px' }}>Monthly Trends</h4>
                  <div className="placeholder-chart" style={{ 
                    height: '180px', 
                    background: '#f5f5f5', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div className="chart-message" style={{ color: '#888' }}>Monthly mood data will appear here</div>
                  </div>
                </div>
                
                <div className="analysis-section feature-item" style={{ 
                  padding: '20px', 
                  borderRadius: '10px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  background: 'white'
                }}>
                  <h4 style={{ marginBottom: '10px' }}>Mood Distribution</h4>
                  <div className="placeholder-chart pie-chart" style={{ 
                    height: '180px', 
                    background: '#f5f5f5', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div className="chart-message" style={{ color: '#888' }}>Distribution will appear here</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Journal; 