const User = require('../models/user');
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail');
SENDGRID_API_KEY=process.env.SENDGRID_API_KEY
sgMail.setApiKey(SENDGRID_API_KEY)


// Handle Errors 
const handleErrors = (err) => {
    let errors = {email:'',password:''};
    // Incorrect Email/Password
    if(err.message === 'Incorrect Email'){
        errors['email'] = "That email is not registered"
    }
    if(err.message === 'Incorrect Password'){
        errors['password'] = "password is incorrect"
    }
    
    
    
    // Checks if an email is already registered by uding err.code
    if (err.code==11000){
        errors['email'] ='The given email is already registered';
        return errors;
    }


    // Checks for all the validation errors in the input fields
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties['path']]=properties['message'];
        }) 
    }
    return errors;
}

// Create JWT
 // Our JWT token stored as cookie in browser will be valid for maxAge (currently : 3 days)
const maxAge = "3*24*60*60";
 const createToken = (id,mAge) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:maxAge })    
};
const createLink = (token) => {
    return "https://midas-authentication.herokuapp.com/change-password/".concat(token);    
};





module.exports.signup_get = (req, res) =>{
    res.render('signup')
}
module.exports.login_get = (req, res) =>{
    res.render('login')
}

module.exports.signup_post = async (req, res) =>{
    const username = req.body["username"];
    const email = req.body["email"];
    const password = req.body["password"];
    try {
        const user = await User.create({username:username,email: email, password: password});
        const token = createToken(user["_id"]);
        res.cookie('jwt',token,{httpOnly:true,maxAge: maxAge *1000})
        return res.status(201).json({user : user._id});
    } 
    catch(err){
        console.log(err);
        const errors = handleErrors(err);
        return res.status(400).json({errors});
    }
    res.send('new signup')
}
module.exports.login_post = async (req, res) =>{
    const {username,email,password} = req.body;
    try {
        const user = await User.login(email,password);
        const token = createToken(user["_id"],3*24*60*60);
        // Also our cookie valid till 3 days
        res.cookie('jwt',token,{httpOnly:true,maxAge: maxAge *1000}) 
        return res.status(201).json({user : user._id});
    } 
    catch(err){
        console.log(err);
        const errors = handleErrors(err);
        return res.status(400).json({errors});
    }
    res.send('new login')
}


module.exports.logout = (req, res) =>{
    res.cookie('jwt','',{maxAge:1});
    req.logout();
    res.redirect('/');
}

module.exports.forgotpass_get = (req, res) =>{
    res.render('fp');
}


module.exports.forgotpass_post = async (req, res) =>{
    const {email} = req.body;
    try {
        const user = await User.user_findby_email(email);
        const token = createToken(user["_id"],15*60);
        var link = createLink(token);
        var mainlink = link

        var t = '<p>This mail consists of the password reset link requested which will expire in next 15 minutes for security purposes , do change your password  by clicking on ' + mainlink+'</p>';

        const msg = {
            to: req.body['email'], // Change to your recipient
            from: '18bcs092@iiitdwd.ac.in', // Change to your verified sender
            subject: 'Password Reset',
            html: t,
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.log(error)
            })
        return res.status(201).json({user : user._id});
    } 
    catch(err){
        console.log(err);
        const errors = handleErrors(err);
        return res.status(400).json({errors});
    }
    res.render('fp');
}


module.exports.changepass_get = (req, res) =>{var token = req.params['token'];
    jwt.verify(token,process.env.JWT_SECRET,(err,decodedToken) => {
        if(err){
            console.log(err);
            res.redirect('/');
        } else {
            console.log(decodedToken['id']);
            console.log("in");
            res.render('cp',{token:decodedToken['id']});
        }
    });
}
module.exports.changepass_post = async (req, res) =>{
    var token = req.body['token'];
    var password = req.body['password'];
    try {
        const user = await User.update_in_db(token,password) ;
}catch(err){
    console.log(err);
    const errors = handleErrors(err);
    console.log(errors);
    return res.status(400).json({errors});
}
};