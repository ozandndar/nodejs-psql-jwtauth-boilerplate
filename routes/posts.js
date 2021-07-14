import express from 'express';
import slugify from 'slugify';
import pool from '../db/index.js';
import { authenticateToken } from '../middleware/authorization.js';


const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        hello: 'world'
    })
});

router.post('/', authenticateToken, async (req, res) => {
    const { post_title, post_description, post_image_url } = req.body;
    console.log(post_title);
    try {
        const posts = await pool.query('INSERT INTO posts (post_title, post_description, post_image_url, post_slug) VALUES($1, $2, $3, $4) RETURNING *', [post_title, post_description, post_image_url, slugify(post_title)]);

        res.json(posts);

    } catch (error) {
        res.status(500).json({
            error
        })
    }
});

router.get('/:id', async (req, res) => {
    const post_id = req.params.id;

    const post = await pool.query('SELECT * FROM posts where post_id = $1', [post_id]);

    res.json(post.rows[0])
});

export default router;