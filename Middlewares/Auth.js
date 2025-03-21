const jwt = require('jsonwebtoken');

// Middleware to authenticate user by checking JWT token
const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check if the Authorization header is present
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: JWT token is required' });
    }

    // Split the 'Bearer' and the token
    const token = authHeader.split(' ')[1];  // Extract the token part

    // If token is missing after splitting
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: JWT token is required' });
    }

    try {
        // Verify the token with the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user info to the request object
        req.user = { 
            _id: decoded._id,  // Use _id to match the controller check
            email: decoded.email
        };
        
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        // Token is invalid or expired
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized: Token has expired' });
        }
        return res.status(401).json({ message: 'Unauthorized: Invalid JWT token' });
    }
};

module.exports = ensureAuthenticated;
