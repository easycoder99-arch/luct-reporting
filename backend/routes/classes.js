const express = require('express');
const Class = require('../models/Class');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all classes for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { role, id } = req.user;
        let classes;

        if (role === 'lecturer') {
            classes = await Class.findByLecturer(id);
        } else {
            classes = await Class.findAll();
        }

        res.json(classes);
    } catch (error) {
        console.error('Get classes error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get class by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const classData = await Class.findById(id);

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.json(classData);
    } catch (error) {
        console.error('Get class error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;