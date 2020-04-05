const mongoose = require('./db.js')
const Schema = mongoose.Schema;
const d = new Date();
const userSchema = new Schema({

    password: { type: String },
    phone: { type: String },
    last_ip: { type: String },
    add_time: {
        type: Number,
        default: d.getTime(),
    },
    email: {

        type: String,
        default: '',

    },
    status: {
        type: Number,
        default: 1
    },
});
module.exports = mongoose.model('User', userSchema, 'user');
