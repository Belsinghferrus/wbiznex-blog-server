import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';
import authRoute from './router/authRoutes.js';
import blogRoute from './router/blogRoutes.js';
import cloudinary from 'cloudinary';
import multer from 'multer';
import pool from './config/db.js';


dotenv.config();
const app = express();
const port = process.env.PORT;


// Middleware
app.use(cors({
     origin: process.env.PRODUCTION, 
     credentials: true }
    ));
app.use(express.json());
app.use(cookieParser());


// MySQL DB connection
 pool.getConnection()
 .then(() => {
    console.log('Connected to MySQL database');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });


// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });



//Routes
app.use('/api/user', authRoute)
app.use('/api/blog', blogRoute)

//health
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})