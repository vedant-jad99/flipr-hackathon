const Mail = require('../models/mail');
const schedule = require('node-schedule');
const sgMail = require('@sendgrid/mail');
var SENDGRID_API_KEY = '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';
sgMail.setApiKey(SENDGRID_API_KEY)


module.exports.mail_save = async (req,res)=>{
    const {to,from,subject,cc,bcc,body,scheduleType,sdate,sent} = req.body;
   
        const mail = await Mail.create({to:to,from:from,subject:subject,cc:cc,bcc:bcc,body:body,scheduleType:scheduleType,sdate:sdate,sent:sent,sent_count:0,last_mail_sent:null})
        console.log("saved"+mail._id);
        // Sending mails
        var months = {"Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12}  ;       
        //At recurrent intervals
        if(mail.scheduleType === "Recurring_20"){
            schedule.scheduleJob('*/20 * * * * *',function(){
                console.log("Mailsend@",new Date().toString());
                console.log(mail);
                var myquery = { "_id": mail._id };
                Mail.findOne(myquery, function(err, result) {
                    if (err) throw err;
                    var counter =result.sent_count;
                    counter++;
                    if(counter==1){
                        var newvalues = { $set: { sent_count: counter , last_mail_sent : new Date() ,sent:true } };        
                    }else{
                        var newvalues = { $set: { sent_count: counter , last_mail_sent : new Date() } };    
                    }
                    Mail.updateOne(myquery, newvalues, function(err, res) {
                        if (err) throw err;
                        console.log("1 document updated");
                      });
                });
                const msg = {
                    to: mail['to'], 
                    from: mail['from'],
                    subject: mail['subject'],
                    text : mail['body']
                }
                sgMail
                    .send(msg)
                    .then(() => {
                        console.log('Email sent')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            });
        }else if(mail.scheduleType === "Recurring_30"){
            schedule.scheduleJob('*/30 * * * * *',function(){
                console.log("Mailsend@",new Date().toString());
                console.log(mail);
                var myquery = { "_id": mail._id };
                Mail.findOne(myquery, function(err, result) {
                    if (err) throw err;
                    var counter =result.sent_count;
                    counter++;
                    if(counter==1){
                        var newvalues = { $set: { sent_count: counter , last_mail_sent : new Date() ,sent:true } };        
                    }else{
                        var newvalues = { $set: { sent_count: counter , last_mail_sent : new Date() } };    
                    }
                    Mail.updateOne(myquery, newvalues, function(err, res) {
                        if (err) throw err;
                        console.log("1 document updated");
                      });
                });
                const msg = {
                    to: mail['to'], 
                    from: mail['from'],
                    subject: mail['subject'],
                    text : mail['body']
                }
                sgMail
                    .send(msg)
                    .then(() => {
                        console.log('Email sent')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
        });
    }
        // }else if(mail.scheduleType == "weekly"){
        //     var mmdd,hhminss=mail.sdate.split( );
        //     var mm,dd = mmdd.split('-');
        //     mm=months[mm];
        //     var hh,min,ss = hhminss.split('-');
        //     var schedulestring="";
        //     // Jul-13 17:56:22
        //     schedulestring.concat(ss,min,hh,dd,mm,"*");
        //     schedule.scheduleJob(mail._id,schedulestring,()=>{
        //         schedule.cancelJob(mail._id);
        //         schedule.scheduleJob(mail._id,"* * * * */7 *",()=>{
        //             //mail
        //         })
        //         // mail
        //         console.log("Mailsend@",new Date().toString());
                
        //     });
        // }else if(mail.scheduleType == "monthly"){
        //     var mmdd,hhminss=mail.sdate.split( );
        //     var mm,dd = mmdd.split('-');
        //     mm=months[mm];
        //     var hh,min,ss = hhminss.split('-');
        //     var schedulestring="";
        //     // Jul-13 17:56:22
        //     schedulestring.concat(ss,min,hh,dd,mm,"*");
        //     schedule.scheduleJob(mail._id,schedulestring,()=>{
        //         schedule.cancelJob(mail._id);
        //         schedule.scheduleJob(mail._id,"@monthly",()=>{
        //             //mail
        //         })
        //         // mail
        //         console.log("Mailsend@",new Date().toString());
        
        //     });
        // }else{
        //     var mmdd,hhminss=mail.sdate.split( );
        //     var mm,dd = mmdd.split('-');
        //     mm=months[mm];
        //     var hh,min,ss = hhminss.split('-');
        //     var schedulestring="";
        //     // Jul-13 17:56:22
        //     schedulestring.concat(ss,min,hh,dd,mm,"*");
        //     schedule.scheduleJob(mail._id,schedulestring,()=>{
        //         schedule.cancelJob(mail._id);
        //         schedule.scheduleJob(mail._id,"@yearly",()=>{
        //             //mail
        //         })
        //         // mail
        //         console.log("Mailsend@",new Date().toString());
        //     });
        // }

        return res.status(201).json({mail : mail._id});
   
}



// Stop sending mails
module.exports.mail_stop_sending = async (req,res)=>{
    const mail= req.body;
    schedule.cancelJob(mail._id);
}

// module.export.mail_send = async(req,res)=>{
//     await Mail.find().then((mails)=>{
//         for(var i=0;i<mails.length;i++){

//         }
//     });    
// }
