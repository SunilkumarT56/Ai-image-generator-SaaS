import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(400).json({
            success: false,
            message: 'Invalid token'
        })
    }
    const token = authHeader.split(' ')[1];
    try{
    const decode = jwt.verify(token , process.env.SECRET_KEY);
    // const user = await User.findById(decode.id).select('-password');
    req.body.userId = decode.id;
    next();
}catch(error){
    res.status(500).json({
        success: false,
        message: 'Invalid token'
    })
}
}