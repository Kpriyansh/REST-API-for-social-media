const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        max:100,
        required:true
    },
    postid:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        required:true
    }
})

module.exports = mongoose.model('Comment',Comment);