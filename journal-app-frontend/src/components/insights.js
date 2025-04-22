import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#FFB5C2', '#FFD8BE', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#BDB2FF', '#FFC6FF', '#EEEEEE'];

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get('/api/journal/insights/weekly');
        setInsights(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch insights');
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const prepareChartData = () => {
    if (!insights || !insights.moodDistribution) return [];
    
    return Object.keys(insights.moodDistribution).map(mood => ({
      name: mood,
      value: insights.moodDistribution[mood]
    }));
  };

  if (loading) {
    return <div className="loading">Loading insights...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const chartData = prepareChartData();

  return (
    <motion.div 
      className="insights-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="insights-card">
        <h2>Weekly Insights</h2>
        
        {insights?.totalEntries === 0 ? (
          <div className="empty-state">
            <p>Not enough journal entries to generate insights yet.</p>
            <p>Keep writing daily to see patterns in your moods!</p>
          </div>
        ) : (
          <>
            <div className="insights-summary">
              <motion.div 
                className="insight-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3>Total Entries</h3>
                <div className="insight-value">{insights?.totalEntries}</div>
              </motion.div>
              
              <motion.div 
                className="insight-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3>Dominant Mood</h3>
                <div className="insight-value dominant-mood">
                  {insights?.dominantMood || 'None'}
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mood-chart"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <h3>Mood Distribution</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p>No mood data available</p>
              )}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Insights;