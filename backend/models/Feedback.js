const pool = require('../config/database');

class Feedback {
    static async create(feedbackData) {
        const { report_id, principal_lecturer_id, feedback_text, rating } = feedbackData;
        
        const [result] = await pool.execute(
            'INSERT INTO feedback (report_id, principal_lecturer_id, feedback_text, rating) VALUES (?, ?, ?, ?)',
            [report_id, principal_lecturer_id, feedback_text, rating]
        );
        return result.insertId;
    }

    static async findByReport(reportId) {
        const [rows] = await pool.execute(
            `SELECT f.*, u.name as principal_lecturer_name 
             FROM feedback f 
             JOIN users u ON f.principal_lecturer_id = u.id 
             WHERE f.report_id = ? 
             ORDER BY f.created_at DESC`,
            [reportId]
        );
        return rows;
    }

    static async update(feedbackId, feedbackData) {
        const { feedback_text, rating } = feedbackData;
        
        const [result] = await pool.execute(
            'UPDATE feedback SET feedback_text = ?, rating = ? WHERE id = ?',
            [feedback_text, rating, feedbackId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Feedback;