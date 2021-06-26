const Mail = require('../models/mail');

module.exports.mail_save = async (req,res)=>{
    const {to,from,subject,cc,bcc,body,scheduleType,sent} = req.body;
    try{
        const mail = await Mail.create({to:to,from:from,subject:subject,cc:cc,bcc:bcc,body:body,scheduleType:scheduleType,sent:sent})
        console.log("saved"+mail._id);
        return res.status(201).json({mail : mail._id});
    }catch(err){
        const errors = handleErrors(err);
        return res.status(400).json({errors});
    }
}
