import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatDate } from '../utils/helpers';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await api.get('/api/journal');
        console.log('Raw API Response:', res.data);
        
        let journalData = Array.isArray(res.data) ? res.data : 
                         res.data.journals ? res.data.journals : 
                         [res.data];
        
        journalData = journalData.filter(j => j && j._id);
        
        console.log('Processed journals:', journalData);
        setJournals(journalData);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch journals');
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  const deleteJournal = async (id) => {
    if (!id) {
      console.error('Invalid journal ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await api.delete(`/api/journal/${id}`);
        if (response.status === 200) {
          setJournals(prevJournals => prevJournals.filter(journal => journal._id !== id));
        } else {
          setError('Failed to delete journal - unexpected response');
        }
      } catch (err) {
        setError(`Failed to delete journal: ${err.message}`);
      }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) {
    return <div className="loading">Loading journals...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Journal</h1>
        <motion.button
          className="btn-add"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/entry">New Entry</Link>
        </motion.button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {journals.length === 0 ? (
        <div className="empty-state">
          <p>No journal entries yet. Start writing your first entry!</p>
        </div>
      ) : (
        <motion.div 
          className="journal-list"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {journals.map(journal => (
            <motion.div 
              key={journal._id} 
              className={`journal-card mood-${journal.mood?.toLowerCase() || 'neutral'}`}
              variants={item}
            >
              <div className="journal-date">{formatDate(journal.date)}</div>
              <h3 className="journal-title">{journal.title || 'Untitled'}</h3>
              <p className="journal-excerpt">
                {journal.content.length > 120 
                  ? `${journal.content.substring(0, 120)}...` 
                  : journal.content}
              </p>
              <div className="journal-mood">
                <span className="mood-indicator"></span>
                <span>{journal.mood || 'No mood'}</span>
              </div>
              <div className="journal-actions">
                <Link to={`/entry/${journal._id}`}>Edit</Link>
                <button onClick={() => deleteJournal(journal._id)}>Delete</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
