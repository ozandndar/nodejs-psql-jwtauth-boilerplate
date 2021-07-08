import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';


// app constants
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    credentials: true,
    origin: process.env.URL || '*'
}

// app configs
app.use(cors(corsOptions));
app.use(json());


app.use('/api/v1.0/users', usersRoutes);
app.use('/api/v1.0/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});