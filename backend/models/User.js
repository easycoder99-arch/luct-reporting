const pool = require('../config/database');

class User {
    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, email, name, role, faculty, department FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async create(userData) {
        const { email, password, name, role, faculty, department } = userData;
        const [result] = await pool.execute(
            'INSERT INTO users (email, password, name, role, faculty, department) VALUES (?, ?, ?, ?, ?, ?)',
            [email, password, name, role, faculty, department]
        );
        return result.insertId;
    }

    static async getUsersByRole(role) {
        const [rows] = await pool.execute(
            'SELECT id, email, name, role, faculty, department FROM users WHERE role = ?',
            [role]
        );
        return rows;
    }
}

module.exports = User;