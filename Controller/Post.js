const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    desc: {
        type:String,
        default:"",
        max:800,
    },
    likes: {
        type:Array,
        default:[],
    },
   image: {
        type:String,
        default:""
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Post', PostSchema);