const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const mailSchema = new Schema({
    to: String,
    from: String,
    subject: String,
    cc:String,
    bcc:String,
    body:String,
    scheduleType:String,
    sdate: String,
    sent: Boolean,
    sent_count : Number,
    last_mail_sent : String
});

const Mail = mongoose.model('mails', mailSchema);

module.exports = Mail;