const express = require('express');
const Feedback = require('../models/Feedback');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Add feedback to report (Principal Lecturer only)
router.post('/', authenticateToken, authorizeRoles('principal_lecturer'), async (req, res) => {
    try {
        const { report_id, feedback_text, rating } = req.body;

        if (!report_id || !feedback_text) {
            return res.status(400).json({ error: 'Report ID and feedback text are required' });
        }

        const feedbackId = await Feedback.create({
            report_id,
            principal_lecturer_id: req.user.id,
            feedback_text,
            rating: rating || null
        });

        res.status(201).json({ 
            message: 'Feedback added successfully', 
            feedbackId 
        });
    } catch (error) {
        console.error('Add feedback error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get feedback for a report
router.get('/report/:reportId', authenticateToken, async (req, res) => {
    try {
        const { reportId } = req.params;
        const feedback = await Feedback.findByReport(reportId);

        res.json(feedback);
    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update feedback
router.put('/:id', authenticateToken, authorizeRoles('principal_lecturer'), async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback_text, rating } = req.body;

        const updated = await Feedback.update(id, { feedback_text, rating });

        if (!updated) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.json({ message: 'Feedback updated successfully' });
    } catch (error) {
        console.error('Update feedback error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;