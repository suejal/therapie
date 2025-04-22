const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ error: "Authentication required. Please provide a token" });
  }
  
  const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;
  
  try {
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token has expired. Please log in again" });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token. Authentication failed" });
    }
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Authentication failed" });
  }
};