const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type : String,
        require: true,
        min: 3,
        max: 30,
        unique: true,
    },
    email:{
        type: String,
        require: true,
        min : 3,
        max: 30,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    profilePicture:{
        type: String,
        default:""
    },
    followers:{
        type: Array,
        default:[],
    },
    following:{
        type: Array,
        default:[],
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc:{
        type:String,
        max:70,
    },
    city:{
        type: String,
        max: 50,
    },
    branch:{
        type:String,
        max: 50,
    }
},{
    timestamps: true    
  }
);
module.exports = mongoose.model("User",UserSchema);