const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    email:{
        type : String,
        // Here I've added custom validation error message
        required : [true,'Please enter an email'],
        // But custom messages can't be added to unique (to check if there's already a same email avaliable in databse) 
        unique : true,
        lowercase : true,
        // Here I've added custom validation error message and isEmail checks whether it's correct syntax for email and has been imported from a module called validator 
        validate : [isEmail,'Please enter a valid email']
    },
    password:{
        type : String,
        // Here I've added custom validation error message
        required : [true,'Please enter a password'],
        // Here I've added custom validation error message
        minlength : [5,'Please enter at least 5 characters'],
    }
})


// The functios attached to user schema below are called mongoose hooks and they'll listen for any save function performed to Database just before saving and after saving 

// Fires a function after a user saved to database
userSchema.post('save', function(doc,next) {
    console.log('user was created and saved to database',doc);
    // It is used since this allows express to know that we need to move to the next middleware 
    next();
})

// Fires a function before doc saved to database (acceses the local copy using this )
userSchema.pre('save',async function(next) {
    // Used to hash the password by :  hash(password + salt) = hashed password
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log('user was created and saved to database',this);
    // It is used since this allows express to know that we need to move to the next middleware
    next();
})
// Fires a function before doc updated to database (acceses the local copy using this )
userSchema.pre('findByIdAndUpdate',async function(next) {
    // Used to hash the password by :  hash(password + salt) = hashed password
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log('user updated and saved to database',this);
    // It is used since this allows express to know that we need to move to the next middleware
    next();
})
// Fires a function after a user updated to database
userSchema.post('findByIdAndUpdate', function(doc,next) {
    console.log('user was updated and saved to database',doc);
    // It is used since this allows express to know that we need to move to the next middleware 
    next();
})


// static method to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({"email": email});
    if(user){
        const auth  = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        else{
            throw Error('Incorrect Password');
        }        
    } else{
        throw new Error('Incorrect Email')
    }
}

// static method to find user
userSchema.statics.user_findby_email = async function(email){
    const user = await this.findOne({"email": email});
    if(user){
        return user;       
    } else{
        throw new Error('Incorrect Email')
    }
}

// static method to update
userSchema.statics.update_in_db = async function(token, password){
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    const user = await this.findByIdAndUpdate(token,{"password": password,function(err, docs){
        if(err){
            throw new Error("Incorrect Email")
        }
        else{
            return res.status(201).json({user :docs['_id']});
        }        

    }});
}


const user = mongoose.model('user', userSchema);

module.exports =user;