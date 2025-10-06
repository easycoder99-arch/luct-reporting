const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'luct_reporting_system_secret_key_2024';

class AuthController {
    static async register(req, res) {
        let connection;
        try {
            console.log('📝 Registration attempt:', req.body);
            
            const { email, password, name, role, faculty, department } = req.body;
            
            // Validate required fields
            if (!email || !password || !name || !role) {
                return res.status(400).json({ error: 'Email, password, name, and role are required' });
            }

            connection = await pool.getConnection();
            
            // Check if user already exists
            const [existingUsers] = await connection.execute(
                'SELECT id FROM users WHERE email = ?', 
                [email]
            );
            
            if (existingUsers.length > 0) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);
            
            // Insert user
            const [result] = await connection.execute(
                'INSERT INTO users (email, password, name, role, faculty, department) VALUES (?, ?, ?, ?, ?, ?)',
                [email, hashedPassword, name, role, faculty || 'ICT', department || 'General']
            );

            console.log('✅ User registered successfully. ID:', result.insertId);
            
            res.status(201).json({ 
                success: true,
                message: 'User registered successfully!',
                userId: result.insertId
            });
            
        } catch (error) {
            console.error('❌ Registration error:', error.message);
            res.status(500).json({ 
                error: 'Registration failed. Please try again.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        } finally {
            if (connection) connection.release();
        }
    }

    static async login(req, res) {
        let connection;
        try {
            const { email, password } = req.body;
            
            console.log('🔐 Login attempt for:', email);
            
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password required' });
            }

            connection = await pool.getConnection();
            
            // Find user
            const [users] = await connection.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            
            if (users.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            
            const user = users[0];
            const validPassword = await bcrypt.compare(password, user.password);
            
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Create token
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role 
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            console.log('✅ Login successful for:', user.email);
            
            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    faculty: user.faculty,
                    department: user.department
                }
            });
            
        } catch (error) {
            console.error('❌ Login error:', error.message);
            res.status(500).json({ error: 'Login failed' });
        } finally {
            if (connection) connection.release();
        }
    }

    static async getProfile(req, res) {
        let connection;
        try {
            connection = await pool.getConnection();
            
            const [users] = await connection.execute(
                'SELECT id, email, name, role, faculty, department FROM users WHERE id = ?',
                [req.user.id]
            );
            
            if (users.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(users[0]);
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = AuthController;