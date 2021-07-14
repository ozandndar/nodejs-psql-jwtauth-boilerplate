import express from 'express';
import pool from '../db/index.js';
import bcrypt from 'bcrypt';

// middlewares
import { authenticateToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/', authenticateToken ,async (req, res) => {
    try {
        const users = await (await pool.query('SELECT user_id, user_name, user_email FROM users')).rows;
        res.json(users);
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    try {
        if (name && email && password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await (await pool.query('INSERT INTO users(user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING user_name, user_email', [name, email, hashedPassword])).rows[0];
            res.json(user);
        }
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

export default router;