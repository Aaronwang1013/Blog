const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        requireed: true,
        unique: true
    },
    password: {
        type: String,
        requireed: true,
    },
});


module.exports =mongoose.model('User' , UserSchema);