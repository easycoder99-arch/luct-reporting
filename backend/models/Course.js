const pool = require('../config/database');

class Course {
    static async findAll() {
        const [rows] = await pool.execute(
            'SELECT * FROM courses ORDER BY course_code'
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM courses WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async search(query) {
        const [rows] = await pool.execute(
            'SELECT * FROM courses WHERE course_name LIKE ? OR course_code LIKE ? ORDER BY course_code',
            [`%${query}%`, `%${query}%`]
        );
        return rows;
    }

    static async create(courseData) {
        const { course_code, course_name, program_leader_id, faculty } = courseData;
        const [result] = await pool.execute(
            'INSERT INTO courses (course_code, course_name, program_leader_id, faculty) VALUES (?, ?, ?, ?)',
            [course_code, course_name, program_leader_id, faculty]
        );
        return result.insertId;
    }
}

module.exports = Course;