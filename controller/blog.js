import pool from "../config/db.js";
import cloudinary from 'cloudinary';
import fs from 'fs';


export const allBlogs = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(rows);
}

export const singleBlog = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.sendStatus(404);
    res.json(rows[0]);
}

export const createBlog = async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const filePath = req.file.path;
    try {
        const result = await cloudinary.uploader.upload(filePath);
        fs.unlinkSync(filePath);
        const imageUrl = result.secure_url;

        await pool.query(
            'INSERT INTO blogs (title, content, image, created_at) VALUES (?, ?, ?, NOW())',
            [title, content, imageUrl]
        );
        res.sendStatus(201);
    } catch (err) {
        res.status(500).json({ error: 'Upload failed' });
        console.log("Error in Create Blog:", err);

    }
}

export const editBlog = async (req, res) => {
    const { title, content } = req.body;
    let imageUrl = req.body.imageUrl || null;
    console.log("File received:", req.file)
    try {
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        fs.unlinkSync(req.file.path);
        imageUrl = result.secure_url;     
      }
  
      if (imageUrl) {
        await pool.query(
          'UPDATE blogs SET title = ?, content = ?, image = ? WHERE id = ?',
          [title, content, imageUrl, req.params.id]
        );
      } else {
        await pool.query(
          'UPDATE blogs SET title = ?, content = ? WHERE id = ?',
          [title, content, req.params.id]
        );
      }
  
      res.sendStatus(200);
    } catch (error) {
      console.log("Error in Edit Blog:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  

export const deleteBlog = async (req, res) => {
    await pool.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.sendStatus(204);
}