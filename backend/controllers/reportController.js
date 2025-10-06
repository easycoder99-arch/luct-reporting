const Report = require('../models/Report');

class ReportController {
    static async createReport(req, res) {
        try {
            console.log('📋 Creating report:', req.body);
            
            const {
                faculty_name, class_id, week_of_reporting, date_of_lecture, course_id,
                actual_students_present, venue, scheduled_lecture_time, topic_taught,
                learning_outcomes, recommendations
            } = req.body;

            // Validate required fields
            if (!faculty_name || !class_id || !week_of_reporting || !date_of_lecture || 
                !course_id || !actual_students_present || !venue || !scheduled_lecture_time || 
                !topic_taught || !learning_outcomes) {
                return res.status(400).json({ 
                    error: 'All required fields must be filled' 
                });
            }

            const reportId = await Report.create({
                faculty_name,
                class_id,
                week_of_reporting,
                date_of_lecture,
                course_id,
                lecturer_id: req.user.id,
                actual_students_present,
                venue,
                scheduled_lecture_time,
                topic_taught,
                learning_outcomes,
                recommendations: recommendations || ''
            });

            console.log('✅ Report created successfully. ID:', reportId);
            
            res.status(201).json({ 
                message: 'Report created successfully', 
                id: reportId 
            });
        } catch (error) {
            console.error('❌ Create report error:', error);
            res.status(500).json({ 
                error: 'Failed to create report',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    static async getReports(req, res) {
        try {
            const { role, id } = req.user;
            let reports;

            if (role === 'lecturer') {
                reports = await Report.findByLecturer(id);
            } else if (role === 'principal_lecturer') {
                // Get faculty from user and find reports for that faculty
                const User = require('../models/User');
                const user = await User.findById(id);
                reports = await Report.findByFaculty(user.faculty);
            } else {
                reports = await Report.findAll();
            }

            res.json(reports);
        } catch (error) {
            console.error('Get reports error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getReportById(req, res) {
        try {
            const { id } = req.params;
            const report = await Report.findById(id);

            if (!report) {
                return res.status(404).json({ error: 'Report not found' });
            }

            res.json(report);
        } catch (error) {
            console.error('Get report error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = ReportController;