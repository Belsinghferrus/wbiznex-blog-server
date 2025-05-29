import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';



export const register = async(req, res) => {
    const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await pool.query('INSERT INTO admins (email, password) VALUES (?, ?)', [email, hashedPassword]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
    console.log("Error in Register:", err);
  }
}

export const login = async(req, res) => {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true, sameSite: 'Strict' });
    res.json({ message: 'Login successful', email, token });
    res.sendStatus(200);
}

export const logout = () => {
    res.clearCookie('token');
    res.sendStatus(200);
}