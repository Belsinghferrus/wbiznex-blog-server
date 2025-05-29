import jwt from 'jsonwebtoken';



// JWT middleware
function protectRoute(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;

      
      next();
    });
  }

  export default protectRoute;



