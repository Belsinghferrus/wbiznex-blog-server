import jwt from 'jsonwebtoken';



// JWT middleware
function protectRoute(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token found' });
    }  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }
  }
  

  export default protectRoute;



