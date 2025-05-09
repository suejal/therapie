const Journal = require('../models/journalModel');
const { Groq } = require('groq-sdk');

const groq = new Groq({
  apiKey: "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",
});

exports.createJournal = async (req, res) => {
  try {
    if (!req.body.content) {
      return res.status(400).json({ error: "Journal content is required" });
    }
    
    const newEntry = new Journal({ ...req.body, user: req.user.id });
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: "Validation error", details: err.message });
    }
    console.error("Journal creation error:", err);
    res.status(500).json({ error: "Server error while creating journal entry" });
  }
};

exports.getJournals = async (req, res) => {
  try {
    console.log('Fetching journals for user:', req.user.id);
    const journals = await Journal.find({ user: req.user.id }).sort({ date: -1 });
    console.log('Found journals:', journals);
    
    if (journals.length === 0) {
      return res.status(200).json([]);
    }
    res.json(journals);
  } catch (err) {
    console.error("Error fetching journals:", err);
    res.status(500).json({ error: "Failed to retrieve journal entries" });
  }
};

exports.getJournal = async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!journal) {
      return res.status(404).json({ error: "Journal entry not found or unauthorized access" });
    }
    
    res.json(journal);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid journal ID format" });
    }
    console.error("Error fetching journal:", err);
    res.status(500).json({ error: "Failed to retrieve journal entry" });
  }
};

exports.updateJournal = async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!journal) {
      return res.status(404).json({ error: "Journal entry not found or unauthorized access" });
    }
    
    const updated = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updated);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid journal ID format" });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: "Validation error", details: err.message });
    }
    console.error("Journal update error:", err);
    res.status(500).json({ error: "Server error while updating journal entry" });
  }
};

exports.deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!journal) {
      return res.status(404).json({ error: "Journal entry not found or unauthorized access" });
    }
    
    await Journal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Journal entry successfully deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid journal ID format" });
    }
    console.error("Journal deletion error:", err);
    res.status(500).json({ error: "Server error while deleting journal entry" });
  }
};

exports.getWeeklyInsights = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const entries = await Journal.find({
      user: req.user.id,
      date: { $gte: oneWeekAgo }
    });
    
    const moodCount = {};
    entries.forEach(entry => {
      if (entry.mood) {
        moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
      }
    });
    
    let dominantMood = null;
    let maxCount = 0;
    
    Object.keys(moodCount).forEach(mood => {
      if (moodCount[mood] > maxCount) {
        maxCount = moodCount[mood];
        dominantMood = mood;
      }
    });
    
    res.json({
      totalEntries: entries.length,
      moodDistribution: moodCount,
      dominantMood,
    });

  } catch (err) {
    console.error("Error generating insights:", err);
    res.status(500).json({ error: "Failed to generate weekly insights" });
  }
};

exports.analyzeJournalMood = async (req, res) => {
  try {
    const { journalId } = req.params;
    
    console.log('Analyzing journal with ID:', journalId);
    console.log('User ID:', req.user.id);
    
    if (!journalId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid journal ID format" });
    }
    
    try {
      const journal = await Journal.findOne({ 
        _id: journalId,
        user: req.user.id 
      });
      
      if (!journal) {
        console.log('Journal not found for ID:', journalId);
        return res.status(404).json({ error: "Journal entry not found" });
      }
      
      const User = require('../models/User'); 
      const user = await User.findById(req.user.id);
      const userName = user ? (user.name || user.email.split('@')[0]) : '';
      
      console.log('Journal found, content:', journal.content.substring(0, 50) + '...');
      
      try {
        const response = await groq.chat.completions.create({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system", 
              content: `You are a helpful therapeutic assistant. Address the user directly using "you" language (not "the writer" or third person). ${userName ? `The user's name is ${userName}, so you can occasionally use their name.` : ''}\n\nAnalyze the journal entry and provide your response in the following format:\n\n1. Start with a 'TLDR' section (2-3 sentences) that briefly states the user's mood and 1-2 key recommendations of what they should do and avoid.\n\n2. Then provide a more detailed analysis with the following sections:\n   - Your current mood and emotional state\n   - Three suggestions to improve your mood\n   - Two things you should avoid\n   - A short piece of advice\n\nKeep each section brief, compassionate, and use direct "you" language throughout.`
            },
            {
              role: "user",
              content: `Journal entry: ${journal.content}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        });
        
        const analysis = response.choices[0].message.content;
        console.log('Analysis generated successfully');
        
        res.json({ analysis });
      } catch (aiError) {
        console.error('AI API error:', aiError);
        res.status(500).json({ 
          error: "AI service error", 
          details: aiError.message,
          stack: aiError.stack
        });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      res.status(500).json({ 
        error: "Database error", 
        details: dbError.message,
        stack: dbError.stack
      });
    }
  } catch (err) {
    console.error("General error analyzing journal mood:", err);
    res.status(500).json({ 
      error: "Failed to analyze journal entry", 
      details: err.message,
      stack: err.stack
    });
  }
};

exports.testGroqAPI = async (req, res) => {
  try {
    console.log('Testing Groq API...');
    
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system", 
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: "Hello, can you give me a short response to test the API?"
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });
    
    console.log('Groq API test successful');
    res.json({ 
      success: true, 
      message: response.choices[0].message.content 
    });
  } catch (err) {
    console.error('Groq API test error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      stack: err.stack
    });
  }
}; 