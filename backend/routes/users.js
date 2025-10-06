const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all lecturers
router.get('/lecturers', authenticateToken, async (req, res) => {
    try {
        const [lecturers] = await pool.execute(
            'SELECT id, name, email FROM users WHERE role = "lecturer" ORDER BY name'
        );
        
        console.log(`✅ Found ${lecturers.length} lecturers`);
        res.json(lecturers);
    } catch (error) {
        console.error('❌ Get lecturers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users (for admin purposes)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, email, name, role, faculty, department FROM users ORDER BY name'
        );
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;