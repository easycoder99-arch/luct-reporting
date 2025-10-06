const pool = require('../config/database');

class Class {
    static async findByLecturer(lecturerId) {
        const [rows] = await pool.execute(
            `SELECT c.*, co.course_code, co.course_name, u.name as lecturer_name
             FROM classes c
             JOIN courses co ON c.course_id = co.id
             JOIN users u ON c.lecturer_id = u.id
             WHERE c.lecturer_id = ?
             ORDER BY c.class_name`,
            [lecturerId]
        );
        return rows;
    }

    static async findAll() {
        const [rows] = await pool.execute(
            `SELECT c.*, co.course_code, co.course_name, u.name as lecturer_name
             FROM classes c
             JOIN courses co ON c.course_id = co.id
             JOIN users u ON c.lecturer_id = u.id
             ORDER BY c.class_name`
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT c.*, co.course_code, co.course_name, u.name as lecturer_name
             FROM classes c
             JOIN courses co ON c.course_id = co.id
             JOIN users u ON c.lecturer_id = u.id
             WHERE c.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async search(query, lecturerId = null) {
        let sql = `
            SELECT c.*, co.course_code, co.course_name, u.name as lecturer_name
            FROM classes c
            JOIN courses co ON c.course_id = co.id
            JOIN users u ON c.lecturer_id = u.id
            WHERE (c.class_name LIKE ? OR co.course_name LIKE ? OR co.course_code LIKE ?)
        `;
        let params = [`%${query}%`, `%${query}%`, `%${query}%`];

        if (lecturerId) {
            sql += ' AND c.lecturer_id = ?';
            params.push(lecturerId);
        }

        sql += ' ORDER BY c.class_name';

        const [rows] = await pool.execute(sql, params);
        return rows;
    }
}

module.exports = Class;