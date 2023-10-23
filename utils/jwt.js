import jsonwebtoken from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../constants.js'
const createAccessToken = (user) => {
    const expToken = new Date();
    expToken.setHours(expToken.getHours() + 24);
    const payload = {
        token_type: "access",
        user_id:user._id,
        iat: Date.now(),
        exp: expToken.getTime(),
    }
    return jsonwebtoken.sign(payload, JWT_SECRET_KEY);
}


const refreshAccessToken = (user) => {

    const expToken = new Date();
    expToken.setMonth(expToken.getMonth()+1)
  
    const payload = {
        token_type: "access",
        user_id:user._id,
        iat: Date.now(),
        exp: expToken.getTime(),
    }
    return jsonwebtoken.sign(payload, JWT_SECRET_KEY);
}
const decoded = (token) => {
 
    return jsonwebtoken.decode(token, JWT_SECRET_KEY,true);
}


export const jwt = {
    refreshAccessToken,
    createAccessToken,decoded
}