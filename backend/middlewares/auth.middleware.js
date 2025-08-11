const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/ApiResponse");

// Authentication middleware - verifies JWT token
const auth = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return ApiResponse.unauthorized("Access denied. No token provided.").send(res);
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    
    // Check if it's a JWT-specific error
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized("Invalid or expired token").send(res);
    }
    
    return ApiResponse.internalServerError().send(res);
  }
};

module.exports = auth;
