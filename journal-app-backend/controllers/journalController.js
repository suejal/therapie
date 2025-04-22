const Journal = require('../models/journalModel');

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



