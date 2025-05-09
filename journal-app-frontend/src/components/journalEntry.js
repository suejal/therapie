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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

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
          setError('Failed to fetch journal entry');
          setLoading(false);
        }
      };
      
      fetchJournal();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      if (id) {
        await api.put(`/api/journal/${id}`, formData);
      } else {
        await api.post('/api/journal', formData);
      }
      setLoading(false);
      navigate('/journal');
    } catch (err) {
      setError('Failed to save journal entry');
      setLoading(false);
    }
  };

  const analyzeJournalMood = async () => {
    if (!id) {
      try {
        setLoading(true);
        const res = await api.post('/api/journal', formData);
        setLoading(false);
        
        if (!res.data || !res.data._id) {
          console.error('Invalid response from save:', res);
          setError('Failed to save journal entry: No ID returned');
          return;
        }
        
        const newId = res.data._id;
        console.log('Journal saved with ID:', newId);
      
        setAnalyzing(true);
        try {
          const analysisRes = await api.get(`/api/journal/analyze/${newId}`);
          console.log('Analysis response:', analysisRes);
          setAnalysis(analysisRes.data.analysis);
          setAnalyzing(false);
          
          navigate(`/entry/${newId}`);
        } catch (analysisErr) {
          console.error('Analysis error:', analysisErr);
          setError(`Failed to analyze: ${analysisErr.response?.data?.error || analysisErr.message}`);
          setAnalyzing(false);
        }
      } catch (err) {
        console.error('Save error:', err);
        setError(`Failed to save: ${err.response?.data?.error || err.message}`);
        setLoading(false);
        setAnalyzing(false);
      }
    } else {
      try {
        setAnalyzing(true);
        console.log('Analyzing existing entry with ID:', id);
        const res = await api.get(`/api/journal/analyze/${id}`);
        console.log('Analysis response:', res);
        setAnalysis(res.data.analysis);
        setAnalyzing(false);
      } catch (err) {
        console.error('Analysis error for existing entry:', err);
        setError(`Failed to analyze: ${err.response?.data?.error || err.message}`);
        setAnalyzing(false);
      }
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
          
          <div className="form-actions">
            <motion.button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/journal')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Entry'}
            </motion.button>
            <motion.button
              type="button"
              className="btn-analyze"
              onClick={analyzeJournalMood}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={analyzing || !formData.content}
            >
              {analyzing ? 'Analyzing...' : 'AI Analysis'}
            </motion.button>
          </div>
        </form>
        
        {analysis && (
          <motion.div 
            className="analysis-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3>AI Analysis</h3>
            <div className="analysis-content">
              {analysis.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        )}
        
        {analyzing && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Analyzing your journal entry...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default JournalEntry; 