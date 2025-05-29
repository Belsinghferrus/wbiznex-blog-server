import express from 'express'
import { singleBlog, createBlog, editBlog, deleteBlog, allBlogs } from '../controller/blog.js';
import protectRoute from '../middleware/authMiddleware.js';
import { upload } from '../config/multer.js';

const router = express.Router();

router.get('/', allBlogs);
router.get('/:id', singleBlog);
router.post('/add', upload.single('image'), createBlog);
router.put('/edit/:id',protectRoute, editBlog);
router.delete('/delete/:id',protectRoute, deleteBlog);

export default router;