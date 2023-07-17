import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // jika tidak kirim token akan null tapi jika ada akan terisi token
    if(token == null) return res.sendStatus(401); // Unauthorized
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403); // Forbidden
        req.email = decoded.email;
        next();
    })
}