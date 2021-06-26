const jwt = require('jsonwebtoken');
const User = require('../models/user');
const requireAuth =(req,res,next) => {
    const token = req.cookies['jwt'];
    const user =req.user;
    // Checking if our jwt token that we've sent while allowing user to sign up and login is valid or not.
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,(err,decodedToken) => {
            if(err){
                res.redirect('/login');
            } else {
                next(); 
            }
        });
    }else if(user){
        next();
    }else{
        res.redirect('/login')
    }
}

//check current user
const checkUser = async (req,res,next) => {
    const token = req.cookies['jwt'];
    const user =req.user;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,async (err,decodedToken) => {
            if(err){
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken['id']);
                res.locals.user = user;
                next(); 
            }
        });
    }else if(user){
        res.locals.user = user;
        next(); 
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth,checkUser};