import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';

const moodOptions = ['Happy', 'Calm', 'Sad', 'Anxious', 'Excited', 'Tired', 'Grateful', 'Frustrated'];

const JournalEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchJournal = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/api/journal/${id}`);
          setFormData({
            title: res.data.title || '',
            content: res.data.content || '',
            mood: res.data.mood || ''
          });
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch journal');
          setLoading(false);
        }
      };

      fetchJournal();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.content || formData.content.trim() === '') {
      setError('Journal content is required');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Submitting entry:', formData);
      
      if (id) {
        const response = await api.put(`/api/journal/${id}`, formData);
        console.log('Update response:', response.data);
        
      } else {
        const response = await api.post('/api/journal/add', formData);
        console.log('Create response:', response.data);
      }
      
      setLoading(false);
      navigate('/journal', { state: { refreshEntries: true } });
    } catch (err) {
      console.error('Error saving entry:', err);
      setError(err.response?.data?.error || 'Failed to save journal');
      setLoading(false);
    }
  };
  
  return (
    <motion.div 
      className="entry-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="entry-card">
        <h2>{id ? 'Edit Journal Entry' : 'New Journal Entry'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title (optional)"
            />
          </div>
          <div className="form-group">
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="How are you feeling today?"
              required
              rows="8"
            />
          </div>
          <div className="form-group mood-selector">
            <label>How's your mood?</label>
            <div className="mood-options">
              {moodOptions.map(mood => (
                <motion.button
                  key={mood}
                  type="button"
                  className={`mood-button ${formData.mood === mood ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, mood })}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {mood}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <motion.button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/journal')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Saving...' : id ? 'Update' : 'Save'}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default JournalEntry; 