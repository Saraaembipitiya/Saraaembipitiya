const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config()
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    street:{
        type:String,
        required:true
    },
    apartment:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true
    },
})

userSchema.methods.genToken = function(){
    return jsonwebtoken.sign({userId:this._id, isAdmin:this.isAdmin}, process.env.SECRET, {expiresIn:"30d"})
}

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    
    this.password = await bcrypt.hash(this.password, salt)
})

exports.User = mongoose.model('User', userSchema);
