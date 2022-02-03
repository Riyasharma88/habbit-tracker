const jwt = require("jsonwebtoken");

const checkToken = async (req, res, next) => {
    let token = req.get("Authorization");
    let JWT_KEY = "goJJmPoJVx@UH1EXoKILW%03HqwEuhta&A3nUEx3Itd$a61D4v4e7l";

    if (token) {
        // Remove Bearer from string
        token = token.slice(7);

        // Verify Token
        // jwt.verify(token, process.env.JWT_KEY, async(err, decoded) => {
        jwt.verify(token, JWT_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Unauthenticated",
                    err,
                });
            }
            // login User information store
            req.userid = decoded;
            // console.log(decoded);
            next();
        });
    } else {
        return res.status(401).json({
            message: "Unauthenticated",
        });
    }
};

         // Access user Profile ( Phone-Number)
const generateAccessToken = (value) => {
    let JWT_KEY = "goJJmPoJVx@UH1EXoKILW%03HqwEuhta&A3nUEx3Itd$a61D4v4e7l";
    return jwt.sign(value, JWT_KEY);
}



module.exports = {
    Auth: checkToken,
    generateAccessToken: generateAccessToken
}