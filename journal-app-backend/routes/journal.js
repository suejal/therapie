const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const auth = require('../middleware/auth');

router.get('/test/groq', journalController.testGroqAPI);
router.post('/', auth, journalController.createJournal);

router.get('/', auth, journalController.getJournals);
router.get('/insights/weekly', auth, journalController.getWeeklyInsights);
router.get('/analyze/:journalId', auth, journalController.analyzeJournalMood);
router.get('/:id', auth, journalController.getJournal);

router.put('/:id', auth, journalController.updateJournal);
router.delete('/:id', auth, journalController.deleteJournal);

module.exports = router; 