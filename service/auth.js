const jwt = require("jsonwebtoken");
const Profile = require("../models/profile.mongo");
require("dotenv").config();

async function authenticateToken(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            error: "No token provided, authorization denied",
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const profile = await Profile.findOne({id: decoded.id});
        
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found.' });
        }
        
        if(parseInt(req.body.id) !== decoded.id && parseInt(req.params.id) !== decoded.id){
            return res.status(401).json({
                error: "you do not have permission to access this route!",
            });
        }

        // Attach profile information to the request object
        req.profile = profile;

        // Proceed to the next middleware/route handler
        next();
    }
    catch(err){
        console.error(err);
        return res.status(400).json({ error: 'Invalid token.' });
    }
}

module.exports = {
    authenticateToken
};
