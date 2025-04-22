const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const auth = require('../middleware/auth');

router.post('/add', auth, journalController.createJournal);
router.get('/insights/weekly', auth, journalController.getWeeklyInsights);
router.get('/:id', auth, journalController.getJournal);
router.put('/:id', auth, journalController.updateJournal);
router.delete('/:id', auth, journalController.deleteJournal);
router.get('/', auth, journalController.getJournals);

module.exports = router;