const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json("A token is required for authentication");
    }
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;