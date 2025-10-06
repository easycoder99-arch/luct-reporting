const express = require('express');
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Add new course (Program Leader only)
router.post('/', authenticateToken, authorizeRoles('program_leader'), async (req, res) => {
    try {
        const { course_code, course_name, faculty } = req.body;

        if (!course_code || !course_name || !faculty) {
            return res.status(400).json({ error: 'Course code, name, and faculty are required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO courses (course_code, course_name, program_leader_id, faculty) VALUES (?, ?, ?, ?)',
            [course_code, course_name, req.user.id, faculty]
        );

        res.status(201).json({ 
            message: 'Course created successfully', 
            courseId: result.insertId 
        });
    } catch (error) {
        console.error('Create course error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Course code already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update course (Program Leader only)
router.put('/:id', authenticateToken, authorizeRoles('program_leader'), async (req, res) => {
    try {
        const { id } = req.params;
        const { course_code, course_name, faculty } = req.body;

        const [result] = await pool.execute(
            'UPDATE courses SET course_code = ?, course_name = ?, faculty = ? WHERE id = ?',
            [course_code, course_name, faculty, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({ message: 'Course updated successfully' });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Assign lecturer to course (Program Leader only)
router.post('/:id/assign', authenticateToken, authorizeRoles('program_leader'), async (req, res) => {
    try {
        const { id } = req.params;
        const { lecturer_id, class_name, venue, scheduled_time, total_students } = req.body;

        if (!lecturer_id || !class_name) {
            return res.status(400).json({ error: 'Lecturer and class name are required' });
        }

        // Check if lecturer exists and is actually a lecturer
        const [lecturers] = await pool.execute(
            'SELECT id, name FROM users WHERE id = ? AND role = "lecturer"',
            [lecturer_id]
        );

        if (lecturers.length === 0) {
            return res.status(400).json({ error: 'Invalid lecturer selected' });
        }

        // Check if course exists
        const [courses] = await pool.execute(
            'SELECT id FROM courses WHERE id = ?',
            [id]
        );

        if (courses.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Create a new class for this course
        const [result] = await pool.execute(
            'INSERT INTO classes (class_name, course_id, lecturer_id, total_registered_students, venue, scheduled_time) VALUES (?, ?, ?, ?, ?, ?)',
            [class_name, id, lecturer_id, total_students || 0, venue || 'TBA', scheduled_time || '08:00:00']
        );

        res.status(201).json({ 
            message: 'Lecturer assigned to course successfully',
            classId: result.insertId
        });
    } catch (error) {
        console.error('Assign lecturer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;