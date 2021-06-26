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
    sent: Boolean,
});

const Mail = mongoose.model('mails', mailSchema);

module.exports = Mail;