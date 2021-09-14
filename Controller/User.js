const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        min:10,
        max:100,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:3,
        
    },
    followers:{
        type:Array,//keeping userids
        default:[]
    },
    following:{
        type:Array,//keeping userids
        default:[]
    },
    profilePicture:{
        type:String,
        default:"",
    },
    coverPicture:{
        type:String,
        default:"",
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    description:{
        type:String,
        max:150,
        default:"",
    },
    
    country:{
        type:String,
        max:50,
        default:""
    },
    dob:{
        type:Date,
        min:'1900-09-28',
        max:'2021-12-31'
    },
    relationship:{
        type:Number,
        enum:[1,2]
    }

    
},
{
    timestamps:true
}

);

module.exports = mongoose.model('User',UserSchema);