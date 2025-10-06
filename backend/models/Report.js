const pool = require('../config/database');

class Report {
    static async create(reportData) {
        const {
            faculty_name, class_id, week_of_reporting, date_of_lecture, course_id,
            lecturer_id, actual_students_present, venue, scheduled_lecture_time,
            topic_taught, learning_outcomes, recommendations
        } = reportData;

        const [result] = await pool.execute(
            `INSERT INTO reports (
                faculty_name, class_id, week_of_reporting, date_of_lecture, course_id,
                lecturer_id, actual_students_present, venue, scheduled_lecture_time,
                topic_taught, learning_outcomes, recommendations
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                faculty_name, class_id, week_of_reporting, date_of_lecture, course_id,
                lecturer_id, actual_students_present, venue, scheduled_lecture_time,
                topic_taught, learning_outcomes, recommendations || ''
            ]
        );
        return result.insertId;
    }

    static async findByLecturer(lecturerId) {
        const [rows] = await pool.execute(
            `SELECT r.*, c.course_code, c.course_name, cl.class_name
             FROM reports r
             JOIN courses c ON r.course_id = c.id
             JOIN classes cl ON r.class_id = cl.id
             WHERE r.lecturer_id = ?
             ORDER BY r.created_at DESC`,
            [lecturerId]
        );
        return rows;
    }

    static async findByFaculty(faculty) {
        const [rows] = await pool.execute(
            `SELECT r.*, c.course_code, c.course_name, cl.class_name, u.name as lecturer_name
             FROM reports r
             JOIN courses c ON r.course_id = c.id
             JOIN classes cl ON r.class_id = cl.id
             JOIN users u ON r.lecturer_id = u.id
             WHERE r.faculty_name = ?
             ORDER BY r.created_at DESC`,
            [faculty]
        );
        return rows;
    }

    static async findAll() {
        const [rows] = await pool.execute(
            `SELECT r.*, c.course_code, c.course_name, cl.class_name, u.name as lecturer_name
             FROM reports r
             JOIN courses c ON r.course_id = c.id
             JOIN classes cl ON r.class_id = cl.id
             JOIN users u ON r.lecturer_id = u.id
             ORDER BY r.created_at DESC`
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT r.*, c.course_code, c.course_name, cl.class_name, u.name as lecturer_name
             FROM reports r
             JOIN courses c ON r.course_id = c.id
             JOIN classes cl ON r.class_id = cl.id
             JOIN users u ON r.lecturer_id = u.id
             WHERE r.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async search(query, lecturerId = null) {
        let sql = `
            SELECT r.*, c.course_code, c.course_name, cl.class_name, u.name as lecturer_name
            FROM reports r
            JOIN courses c ON r.course_id = c.id
            JOIN classes cl ON r.class_id = cl.id
            JOIN users u ON r.lecturer_id = u.id
            WHERE (c.course_name LIKE ? OR r.topic_taught LIKE ? OR u.name LIKE ?)
        `;
        let params = [`%${query}%`, `%${query}%`, `%${query}%`];

        if (lecturerId) {
            sql += ' AND r.lecturer_id = ?';
            params.push(lecturerId);
        }

        sql += ' ORDER BY r.created_at DESC';

        const [rows] = await pool.execute(sql, params);
        return rows;
    }

    static async findByDateRange(startDate, endDate, lecturerId = null) {
        let sql = `
            SELECT r.*, c.course_code, c.course_name, cl.class_name, u.name as lecturer_name
            FROM reports r
            JOIN courses c ON r.course_id = c.id
            JOIN classes cl ON r.class_id = cl.id
            JOIN users u ON r.lecturer_id = u.id
            WHERE r.date_of_lecture BETWEEN ? AND ?
        `;
        let params = [startDate, endDate];

        if (lecturerId) {
            sql += ' AND r.lecturer_id = ?';
            params.push(lecturerId);
        }

        sql += ' ORDER BY r.date_of_lecture DESC';

        const [rows] = await pool.execute(sql, params);
        return rows;
    }
}

module.exports = Report;