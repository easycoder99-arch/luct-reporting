const express = require('express');
const Report = require('../models/Report');
const Class = require('../models/Class');
const Course = require('../models/Course');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Search endpoint
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { q, type } = req.query;
        const { role, id } = req.user;

        if (!q || !type) {
            return res.status(400).json({ error: 'Query and type parameters are required' });
        }

        let results;

        switch (type) {
            case 'reports':
                results = await Report.search(q, role === 'lecturer' ? id : null);
                break;
                
            case 'courses':
                results = await Course.search(q);
                break;
                
            case 'classes':
                results = await Class.search(q, role === 'lecturer' ? id : null);
                break;
                
            default:
                return res.status(400).json({ error: 'Invalid search type' });
        }

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;