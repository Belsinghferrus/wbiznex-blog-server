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
     origin: 'http://localhost:3000', 
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


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})