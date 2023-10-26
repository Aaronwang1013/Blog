const mongoose = require('mongoose');


const Schema = mongoose.Schema;



const PostSchema = new Schema({
    title: {
        type: String,
        requireed: true,
    },
    body: {
        type: String,
        requireed: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),    
    },
    UpdatedAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports =mongoose.model('Post' , PostSchema);