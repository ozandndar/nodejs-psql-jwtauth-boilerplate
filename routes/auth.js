import express from 'express';
import pool from '../db/index.js';
import bcrypt from 'bcrypt';
import { jwtTokens } from '../utils/jwt-helpers.js'
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (await pool.query('SELECT * FROM users WHERE user_email = $1', [email])).rows;

        if (user.length === 0) {
            return res.status(401).json({
                error: 'Email is incorrect!'
            })
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user[0].user_password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Incorrect password!'
            })
        }

        // Return access and refresh tokens
        let tokens = jwtTokens(user[0]);
        res.json(tokens);

    } catch (e) {
        res.status(401).json({
            error: e.message
        })
    }
});

router.post('/refresh-token', (req, res) => {
    try {
        const refreshToken = req.body.refresh_token;

        if (refreshToken === null) return res.status(401).json({ error: 'Refresh token is not provided!' })

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if( error ) return res.status(403).json({ error : error.message });
    
            let tokens = jwtTokens(user);
            res.json(tokens);            
        });
 
    } catch (e) {

    }
});

export default router;